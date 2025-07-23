const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Tournament = require('../models/Tournaments');
const User = require('../models/User'); // 👉 Import User model

// JOIN a tournament
router.post('/:id/join', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userEmail = decoded.email;

    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    // Already joined?
    if (tournament.participants.includes(userEmail)) {
      return res.status(400).json({ message: 'Already joined' });
    }

    // ✅ 1. Add user to tournament participants
    tournament.participants.push(userEmail);
    await tournament.save();

    // ✅ 2. Add tournament to user.joinedTournaments + award XP
    const user = await User.findOne({ email: userEmail });

    if (!user.joinedTournaments.includes(tournament._id)) {
      user.joinedTournaments.push(tournament._id);
      user.xp += 10; // 🎯 Give 10 XP for joining a tournament
      await user.save();
    }

    res.status(200).json({ message: 'Successfully joined tournament and awarded XP ✅' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error joining tournament' });
  }
});

module.exports = router;
