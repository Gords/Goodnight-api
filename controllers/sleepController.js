const db = require("../models");

const clockIn = async (req, res) => {
	try {
		// Check for existing open sleep session
		const existingOpenSleep = await db.Sleep.findOne({
			where: {
				userId: req.user.id,
				clockOut: null,
			},
		});

		if (existingOpenSleep) {
			return res.status(400).json({
				status: "error",
				message: "You already have an open sleep session",
			});
		}

		const sleep = await db.Sleep.create({
			userId: req.user.id,
			clockIn: new Date(),
		});

		res.json({
			status: "success",
			data: sleep,
		});
	} catch (error) {
		console.error("Clock in error:", error);
		res.status(500).json({
			status: "error",
			message: "Error clocking in",
		});
	}
};

const clockOut = async (req, res) => {
	try {
		const sleep = await db.Sleep.findOne({
			where: {
				userId: req.user.id,
				clockOut: null,
			},
		});

		if (!sleep) {
			return res.status(404).json({
				status: "error",
				message: "No open sleep session found",
			});
		}

		const clockOut = new Date();
		// Update the record with clockOut time
		// The duration will be automatically calculated by the model hook
		await sleep.update({
			clockOut: clockOut,
		});

		// Fetch the updated record to ensure we have the calculated duration
		const updatedSleep = await db.Sleep.findByPk(sleep.id);

		res.json({
			status: "success",
			data: updatedSleep,
		});
	} catch (error) {
		console.error("Clock out error:", error);
		res.status(500).json({
			status: "error",
			message: "Error clocking out",
		});
	}
};

const formatDuration = (duration) => {
	if (!duration) return null;

	const [hours, minutes, seconds] = duration.split(":").map(Number);

	if (hours === 0 && minutes === 0) {
		return `${seconds}s`;
	}
	if (hours === 0) {
		return `${minutes}m ${seconds}s`;
	}
	return `${hours}h ${minutes}m`;
};

const getSleepRecords = async (req, res) => {
	try {
		const records = await db.Sleep.findAll({
			where: { userId: req.user.id },
			order: [["clockIn", "DESC"]],
		});

		const formattedRecords = records.map((record) => {
			const plainRecord = record.get({ plain: true });
			plainRecord.durationFormatted = formatDuration(plainRecord.duration);
			return plainRecord;
		});

		res.json({
			status: "success",
			data: formattedRecords,
		});
	} catch (error) {
		console.error("Get sleep records error:", error);
		res.status(500).json({
			status: "error",
			message: "Error retrieving sleep records",
		});
	}
};

module.exports = {
	clockIn,
	clockOut,
	getSleepRecords,
};
