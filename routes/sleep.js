const express = require('express');
const router = express.Router();
const sleepController = require('../controllers/sleepController');
const authenticate = require('../middlewares/authMiddleware');
const { clockInValidation, clockOutValidation } = require('../middlewares/validation');

router.post('/clock-in',
  authenticate,
  clockInValidation,
  sleepController.clockIn
);

router.post('/clock-out',
  authenticate,
  clockOutValidation,
  sleepController.clockOut
);

router.get('/records',
  authenticate,
  sleepController.getSleepRecords
);

module.exports = router;