const express = require("express");
const router = express.Router();
const followController = require("../controllers/followController");
const authenticate = require("../middlewares/authMiddleware");
const { userIdParamValidation } = require("../middlewares/validation");

// Make sure the controller functions exist before using them
router.post(
	"/:userId/follow",
	authenticate,
	userIdParamValidation,
	followController.followUser,
);

router.delete(
	"/:userId/follow",
	authenticate,
	userIdParamValidation,
	followController.unfollowUser,
);

router.get(
	"/friends/sleep-records",
	authenticate,
	followController.getFriendsSleepRecords,
);

module.exports = router;
