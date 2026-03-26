const express = require("express");
const Groq = require("groq-sdk");
const { validateChat } = require("../middleware/validators");
const { chatLimiter } = require("../middleware/rateLimiter");
const logger = require("../logger");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are Roblox Dev AI, an expert Roblox game developer and Luau engineer with 10+ years of experience building professional Roblox games.

You specialize in:
- Luau scripting (types, metatables, OOP, coroutines, closures)
- RemoteEvents, RemoteFunctions, and secure client-server architecture
- DataStore systems with retry logic, session locking, and caching
- Anti-cheat systems and exploit prevention
- Multiplayer game systems and replication
- Game economy, shops, and Robux monetization (MarketplaceService)
- UI/UX with ScreenGui, TweenService, and responsive layouts
- Performance optimization (memory, rendering, LOD)
- Game architecture and design patterns
- Roblox Studio plugins
- Security best practices

When writing code:
- Always use Luau type annotations
- Write production-ready, clean code
- Include error handling with pcall/xpcall
- Add brief comments for complex logic
- Follow Roblox best practices (server-authoritative, never trust client)
- Use the task library instead of wait() or spawn()
- Format code blocks with \`\`\`luau fences

Respond like a senior engineer: concise, technical, and practical.`;

router.post("/", chatLimiter, validateChat, async (req, res) => {
  const requestId = uuidv4();
  const { message } = req.body;

  logger.info("Chat request", { requestId, ip: req.ip, messageLength: message.length });

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message },
      ],
      max_tokens: 4096,
      temperature: 0.3,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) throw new Error("Empty response from Groq");

    logger.info("Chat response sent", { requestId, responseLength: response.length });
    res.json({ response, requestId });
  } catch (err) {
    logger.error("Chat error", { requestId, error: err.message });

    if (err.status === 429) {
      return res.status(429).json({ error: "AI service is busy. Please try again shortly." });
    }

    res.status(500).json({ error: "Failed to process your request. Please try again." });
  }
});

module.exports = router;
