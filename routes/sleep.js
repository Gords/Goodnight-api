const express = require('express');
const router = express.Router();
const sleepController = require('../controllers/sleepController');
const authenticate = require('../middlewares/authMiddleware');

router.post('/clock-in', authenticate, sleepController.clockIn);
router.post('/clock-out', authenticate, sleepController.clockOut);
router.get('/records', authenticate, sleepController.getSleepRecords);

module.exports = router;