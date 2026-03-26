const { body, validationResult } = require("express-validator");

const validateChat = [
  body("message")
    .trim()
    .notEmpty().withMessage("Message is required.")
    .isString().withMessage("Message must be a string.")
    .isLength({ min: 1, max: 4000 }).withMessage("Message must be between 1 and 4000 characters.")
    .escape(), // sanitize HTML entities

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    next();
  },
];

module.exports = { validateChat };
