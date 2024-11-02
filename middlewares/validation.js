const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Login validation
const loginValidation = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  validate
];

// Follow validation (just validate the userId param is a number)
const followValidation = [
  body('userId')
    .isInt()
    .withMessage('Invalid user ID'),
  validate
];

module.exports = {
  loginValidation,
  followValidation
};