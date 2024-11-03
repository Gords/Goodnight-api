const db = require("../models");

const followUser = async (req, res) => {
	try {
		const userId = Number.parseInt(req.params.userId);

		if (userId === req.user.id) {
			return res.status(400).json({
				status: "error",
				message: "Cannot follow yourself",
			});
		}

		const userToFollow = await db.User.findByPk(userId);
		if (!userToFollow) {
			return res.status(404).json({
				status: "error",
				message: "User not found",
			});
		}

		await db.Follow.create({
			followerId: req.user.id,
			followingId: userId,
		});

		res.json({
			status: "success",
			message: "Successfully followed user",
		});
	} catch (error) {
		if (error.name === "SequelizeUniqueConstraintError") {
			return res.status(400).json({
				status: "error",
				message: "Already following this user",
			});
		}
		console.error("Follow error:", error);
		res.status(500).json({
			status: "error",
			message: "Error following user",
		});
	}
};

const unfollowUser = async (req, res) => {
	try {
		const userId = Number.parseInt(req.params.userId);

		const deleted = await db.Follow.destroy({
			where: {
				followerId: req.user.id,
				followingId: userId,
			},
		});

		if (!deleted) {
			return res.status(404).json({ message: "Follow relationship not found" });
		}

		res.json({ message: "Successfully unfollowed user" });
	} catch (error) {
		console.error("Unfollow error:", error);
		res.status(500).json({ message: "Error unfollowing user" });
	}
};

const getFriendsSleepRecords = async (req, res) => {
	try {
		const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

		const records = await db.Sleep.findAll({
			include: [
				{
					model: db.User,
					as: "user",
					attributes: ["username"],
					required: true,
					include: [
						{
							model: db.User,
							as: "followers",
							where: { id: req.user.id },
							attributes: [],
							required: true,
						},
					],
				},
			],
			where: {
				clockOut: {
					[db.Sequelize.Op.and]: [
						{ [db.Sequelize.Op.gte]: oneWeekAgo },
						{ [db.Sequelize.Op.not]: null },
					],
				},
			},
			order: [["duration", "DESC"]],
			attributes: ["id", "clockIn", "clockOut", "duration"],
		});

		res.json(records);
	} catch (error) {
		console.error("Get friends sleep records error:", error);
		res.status(500).json({ message: "Error retrieving friends sleep records" });
	}
};

module.exports = {
	followUser,
	unfollowUser,
	getFriendsSleepRecords,
};
