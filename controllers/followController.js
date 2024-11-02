const db = require("../models");

exports.followUser = async (req, res) => {
	try {
		const userId = Number.parseInt(req.params.userId);

		if (userId === req.user.id) {
			return res.status(400).json({ message: "Cannot follow yourself" });
		}

		const userToFollow = await db.User.findByPk(userId);
		if (!userToFollow) {
			return res.status(404).json({ message: "User not found" });
		}

		await db.Follow.create({
			followerId: req.user.id,
			followingId: userId,
		});

		res.json({ message: "Successfully followed user" });
	} catch (error) {
		if (error.name === "SequelizeUniqueConstraintError") {
			return res.status(400).json({ message: "Already following this user" });
		}
		console.error("Follow error:", error);
		res.status(500).json({ message: "Error following user" });
	}
};

exports.unfollowUser = async (req, res) => {
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

exports.getFriendsSleepRecords = async (req, res) => {
	try {
		const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

		const records = await db.Sleep.findAll({
			include: [
				{
					model: db.User,
					as: "user",
					attributes: ["username"],
					include: [
						{
							model: db.User,
							as: "followers",
							where: { id: req.user.id },
							attributes: [],
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
