import { check, validationResult } from "express-validator";

const rules = [
  check("words")
    .notEmpty()
    .withMessage("Words are required")
    .isString()
    .withMessage("Words must be a string")
    .custom((value) => {
      const wordCount = value.trim().split(/\s+/).length;
      if (wordCount < 5) {
        throw new Error("Words must contain at least 5 words");
      }
      return true;
    })
    .trim()
    .escape(),
];

export const rulesValidator = [
  ...rules,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];
