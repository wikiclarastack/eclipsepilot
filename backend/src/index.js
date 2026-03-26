require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const { apiLimiter } = require("./middleware/rateLimiter");
const waf = require("./middleware/waf");
const chatRouter = require("./routes/chat");
const logger = require("./logger");

const app = express();
const PORT = process.env.PORT || 3001;

// ── Security headers ──────────────────────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'"],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        logger.warn("CORS blocked", { origin });
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: false, limit: "50kb" }));

// ── WAF & Rate limiting ───────────────────────────────────────────────────────
app.use(waf);
app.use("/api", apiLimiter);

// ── Security logging middleware ───────────────────────────────────────────────
app.use((req, _res, next) => {
  logger.info("Request", {
    method: req.method,
    path: req.path,
    ip: req.ip,
    ua: req.get("user-agent")?.slice(0, 80),
  });
  next();
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));
app.use("/api/chat", chatRouter);

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: "Not found." }));

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  logger.error("Unhandled error", { error: err.message, stack: err.stack });
  res.status(500).json({ error: "Internal server error." });
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  logger.info(`Backend running on port ${PORT}`);
});

module.exports = app;
