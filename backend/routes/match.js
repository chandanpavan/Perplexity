const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const Tournament = require('../models/Tournament');
const MatchResult = require('../models/MatchResult');

// 🔐 Reusable JWT Auth middleware
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.email = decoded.email;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// 🔐 Admin-only middleware
const ADMIN_EMAIL = 'admin@esportspro.com';

function verifyAdmin(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.email !== ADMIN_EMAIL)
      return res.status(403).json({ message: 'Admins only' });

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// ✅ POST /api/match/submit → Save detailed match result and award XP
router.post('/submit', verifyAdmin, async (req, res) => {
  const { tournamentId, winnerEmail, matchResults = [] } = req.body;

  if (!tournamentId || !winnerEmail || matchResults.length === 0) {
    return res.status(400).json({ message: 'tournamentId, winnerEmail, and matchResults required' });
  }

  try {
    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) return res.status(404).json({ message: 'Tournament not found' });

    // Prepare participants list
    const participants = matchResults.map((entry) => entry.email);

    const updates = matchResults.map(async ({ email, kills, placement }) => {
      const user = await User.findOne({ email });
      if (!user) {
        console.warn(`User not found: ${email}`);
        return null;
      }

      const KILL_XP = 10;
      const PLACEMENT_XP = { 1: 50, 2: 40, 3: 30 };
      const bonusXP = PLACEMENT_XP[placement] || 10;
      const earnedXP = (kills * KILL_XP) + bonusXP;

      // Update User Stats
      user.xp += earnedXP;
      user.totalKills = (user.totalKills || 0) + kills;
      user.placementPoints = (user.placementPoints || 0) + placement;
      await user.save();

      return { email, kills, placement, earnedXP };
    });

    const results = (await Promise.all(updates)).filter(Boolean);

    // 💾 Save match result with full data
    await MatchResult.create({
      tournament: tournamentId,
      participants,
      winner: winnerEmail,
      results,
      date: new Date(),
    });

    res.status(200).json({ message: '✅ Match stats submitted & XP awarded', results });
  } catch (err) {
    console.error('Match submit error:', err);
    res.status(500).json({ message: 'Server error submitting match result' });
  }
});

// ✅ GET /api/match/history → Match logs for player (by email)
router.get('/history', requireAuth, async (req, res) => {
  try {
    const matches = await MatchResult.find({
      participants: req.email,
    })
      .populate('tournament', 'game date reward time')
      .sort({ date: -1 });

    res.status(200).json(matches);
  } catch (err) {
    console.error('Match history error:', err);
    res.status(500).json({ message: 'Failed to fetch match history' });
  }
});

module.exports = router;
