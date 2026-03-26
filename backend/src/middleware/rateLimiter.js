const rateLimit = require("express-rate-limit");
const logger = require("../logger");

// General API rate limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn("Rate limit exceeded", { ip: req.ip, path: req.path });
    res.status(429).json({ error: "Too many requests. Please try again later." });
  },
});

// Strict limit for AI chat endpoint
const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn("Chat rate limit exceeded", { ip: req.ip });
    res.status(429).json({ error: "Too many AI requests. Please wait a moment." });
  },
});

module.exports = { apiLimiter, chatLimiter };
