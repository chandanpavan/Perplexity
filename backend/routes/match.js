const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Tournament = require('../models/Tournament');
const MatchResult = require('../models/MatchResult'); // ✅ NEW: import model

// ❗ Admin Authorization Middleware
const ADMIN_EMAIL = 'admin@esportspro.com';

function verifyAdmin(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.email !== ADMIN_EMAIL)
      return res.status(403).json({ message: 'Admins only' });

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// ✅ Submit Match Result + Save Record
router.post('/submit', verifyAdmin, async (req, res) => {
  const { tournamentId, winnerEmail } = req.body;

  if (!tournamentId || !winnerEmail) {
    return res.status(400).json({ message: 'tournamentId and winnerEmail required' });
  }

  try {
    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) return res.status(404).json({ message: 'Tournament not found' });

    const participants = tournament.participants;

    // ✅ Award XP to each participant
    const updatePromises = participants.map(async (email) => {
      const user = await User.findOne({ email });
      if (!user) return;

      const xpGain = email === winnerEmail ? 50 : 10;
      user.xp += xpGain;
      await user.save();
    });

    await Promise.all(updatePromises);

    // ✅ Save MatchResult entry
    await MatchResult.create({
      tournament: tournamentId,
      participants,
      winner: winnerEmail,
    });

    res.status(200).json({ message: '🎯 XP awarded and match result saved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error submitting match result' });
  }
});

// ✅ GET /api/match/history - Return matches for logged-in user
router.get('/history', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userEmail = decoded.email;

    const matches = await MatchResult.find({
      participants: userEmail,
    })
      .populate('tournament', 'game date reward') // show game info
      .sort({ date: -1 });

    res.status(200).json(matches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching match history' });
  }
});

module.exports = router;
