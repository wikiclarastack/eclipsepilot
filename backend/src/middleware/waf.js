const logger = require("../logger");

// Basic WAF: block common attack patterns
const BLOCKED_PATTERNS = [
  // SQL Injection
  /(\bUNION\b|\bSELECT\b|\bDROP\b|\bINSERT\b|\bDELETE\b|\bUPDATE\b|\bEXEC\b)/i,
  // XSS
  /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  // Path traversal
  /\.\.\//g,
  /\.\.\\/g,
  // Null bytes
  /\x00/g,
];

const MAX_BODY_SIZE = 10000; // 10KB max message

function waf(req, res, next) {
  const body = JSON.stringify(req.body || "");

  // Check body size
  if (body.length > MAX_BODY_SIZE) {
    logger.warn("WAF: oversized request blocked", { ip: req.ip, size: body.length });
    return res.status(413).json({ error: "Request too large." });
  }

  // Check for attack patterns
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(body)) {
      logger.warn("WAF: malicious pattern blocked", { ip: req.ip, path: req.path });
      return res.status(400).json({ error: "Invalid request." });
    }
  }

  next();
}

module.exports = waf;
