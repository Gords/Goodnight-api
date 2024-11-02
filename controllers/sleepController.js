const db = require('../models');

const clockIn = async (req, res) => {
  try {
    console.log('User from request:', req.user);

    const existingOpenSleep = await db.Sleep.findOne({
      where: {
        userId: req.user.id,
        clockOut: null
      }
    });

    if (existingOpenSleep) {
      return res.status(400).json({ message: 'You already have an open sleep session' });
    }

    const sleep = await db.Sleep.create({
      userId: req.user.id,
      clockIn: new Date()
    });

    res.json(sleep);
  } catch (error) {
    console.error('Clock in error:', error);
    res.status(500).json({ message: 'Error clocking in', error: error.message });
  }
};

const clockOut = async (req, res) => {
  try {
    const sleep = await db.Sleep.findOne({
      where: {
        userId: req.user.id,
        clockOut: null
      }
    });

    if (!sleep) {
      return res.status(404).json({ message: 'No open sleep session found' });
    }

    sleep.clockOut = new Date();
    await sleep.save();

    res.json(sleep);
  } catch (error) {
    res.status(500).json({ message: 'Error clocking out' });
  }
};

const getSleepRecords = async (req, res) => {
  try {
    const records = await db.Sleep.findAll({
      where: { userId: req.user.id },
      order: [['clockIn', 'DESC']]
    });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving sleep records' });
  }
};

module.exports = {
  clockIn,
  clockOut,
  getSleepRecords
};