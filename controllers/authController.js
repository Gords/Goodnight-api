const jwt = require("jsonwebtoken");
const { verifyPassword } = require("../utils/password");
const db = require("../models");

const login = async (req, res) => {
	try {
		const { username, password } = req.body;
		const user = await db.User.findOne({ where: { username } });

		if (!user || !(await verifyPassword(password, user.password))) {
			return res.status(401).json({
				status: "error",
				message: "Invalid credentials",
			});
		}

		const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
			expiresIn: process.env.JWT_EXPIRES_IN,
		});

		res.json({
			status: "success",
			data: { token },
		});
	} catch (error) {
		console.error("Login error:", error);
		res.status(500).json({
			status: "error",
			message: "Error logging in",
		});
	}
};

module.exports = {
	login,
};
