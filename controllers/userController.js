const db = require("../models");

const getProfile = async (req, res) => {
	try {
		const user = await db.User.findByPk(req.user.id, {
			attributes: ["id", "username", "createdAt"],
			include: [
				{
					model: db.User,
					as: "following",
					attributes: ["id", "username"],
				},
				{
					model: db.User,
					as: "followers",
					attributes: ["id", "username"],
				},
			],
		});

		res.json({
			status: "success",
			data: user,
		});
	} catch (error) {
		console.error("Get profile error:", error);
		res.status(500).json({
			status: "error",
			message: "Error retrieving profile",
		});
	}
};

module.exports = {
	getProfile,
};
