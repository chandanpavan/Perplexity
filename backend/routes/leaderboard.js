const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /api/leaderboard
router.get('/', async (req, res) => {
  try {
    const users = await User.find({})
      .select('email xp -_id')
      .sort({ xp: -1 })
      .limit(10);

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching leaderboard' });
  }
});

module.exports = router;
