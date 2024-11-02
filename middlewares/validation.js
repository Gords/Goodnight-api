const { body, param, validationResult } = require("express-validator");

const validate = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({
			status: "error",
			errors: errors.array().map((err) => ({
				field: err.path,
				message: err.msg,
			})),
		});
	}
	next();
};

// Login validation rules
const loginRules = [
	body("username")
		.trim()
		.notEmpty()
		.withMessage("Username is required")
		.isLength({ min: 3 })
		.withMessage("Username must be at least 3 characters long")
		.matches(/^[a-zA-Z0-9_]+$/)
		.withMessage("Username can only contain letters, numbers and underscores"),
	body("password")
		.notEmpty()
		.withMessage("Password is required")
		.isLength({ min: 6 })
		.withMessage("Password must be at least 6 characters long"),
];

// User ID parameter rules
const userIdRules = [
	param("userId")
		.isInt()
		.withMessage("User ID must be an integer")
		.custom((value, { req }) => {
			if (Number.parseInt(value) === req.user.id) {
				throw new Error("Cannot perform this action on yourself");
			}
			return true;
		}),
];

// Sleep record rules
const clockInRules = [
	body("clockIn")
		.optional()
		.isISO8601()
		.withMessage("Invalid date format")
		.custom((value) => {
			if (new Date(value) > new Date()) {
				throw new Error("Clock-in time cannot be in the future");
			}
			return true;
		}),
];

const clockOutRules = [
	body("clockOut")
		.optional()
		.isISO8601()
		.withMessage("Invalid date format")
		.custom((value) => {
			if (new Date(value) > new Date()) {
				throw new Error("Clock-out time cannot be in the future");
			}
			return true;
		}),
];

// Composed validation middlewares
const loginValidation = [...loginRules, validate];
const userIdParamValidation = [...userIdRules, validate];
const clockInValidation = [...clockInRules, validate];
const clockOutValidation = [...clockOutRules, validate];

module.exports = {
	loginValidation,
	userIdParamValidation,
	clockInValidation,
	clockOutValidation,
};
