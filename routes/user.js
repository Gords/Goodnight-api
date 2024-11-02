const express = require('express');
const router = express.Router();
const followController = require('../controllers/followController');
const authenticate = require('../middlewares/authMiddleware');
const { followValidation } = require('../middlewares/validation');

router.post('/:userId/follow', authenticate, followValidation, followController.followUser);
router.delete('/:userId/follow', authenticate, followValidation, followController.unfollowUser);
router.get('/friends/sleep-records', authenticate, followController.getFriendsSleepRecords);

module.exports = router;