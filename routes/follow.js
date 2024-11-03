const express = require("express");
const router = express.Router();
const followController = require("../controllers/followController");
const authenticate = require("../middlewares/authMiddleware");
const { userIdParamValidation } = require("../middlewares/validation");

router.post(
	"/:userId",
	authenticate,
	userIdParamValidation,
	followController.followUser,
);
router.delete(
	"/:userId",
	authenticate,
	userIdParamValidation,
	followController.unfollowUser,
);
router.get(
	"/sleep-records",
	authenticate,
	followController.getFriendsSleepRecords,
);

module.exports = router;
