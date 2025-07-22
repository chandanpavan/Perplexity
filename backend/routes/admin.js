const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Tournament = require('../models/Tournament');
const User = require('../models/User');
const MatchXP = require('../models/MatchXP'); // ✅ New model to log XP history

const ADMIN_EMAIL = 'admin@esportspro.com';

// 🔐 Admin Middleware
function verifyAdmin(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.email !== ADMIN_EMAIL) return res.status(403).json({ message: 'Admins only' });

    req.user = decoded;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Unauthorized: Token error' });
  }
}

// ✅ CREATE Tournament
router.post('/create', verifyAdmin, async (req, res) => {
  try {
    const { game, date, time, reward, status } = req.body;

    if (!game || !date || !time || !reward || !status) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newTournament = new Tournament({
      game,
      date,
      time,
      reward,
      status,
      participants: [],
    });

    await newTournament.save();
    res.status(201).json({ message: 'Tournament created', tournament: newTournament });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error creating tournament' });
  }
});

// ✅ READ Tournaments
router.get('/tournaments', verifyAdmin, async (req, res) => {
  try {
    const tournaments = await Tournament.find().sort({ date: 1 });
    res.status(200).json(tournaments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching tournaments' });
  }
});

// ✅ UPDATE Tournament
router.put('/tournaments/:id', verifyAdmin, async (req, res) => {
  try {
    const tournament = await Tournament.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!tournament) return res.status(404).json({ message: 'Tournament not found' });

    res.status(200).json({ message: 'Tournament updated', updated: tournament });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating tournament' });
  }
});

// ✅ DELETE Tournament
router.delete('/tournaments/:id', verifyAdmin, async (req, res) => {
  try {
    const deleted = await Tournament.findByIdAndDelete(req.params.id);

    if (!deleted) return res.status(404).json({ message: 'Tournament not found' });

    res.status(200).json({ message: 'Tournament deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting tournament' });
  }
});

// ✅ NEW: Assign XP to user and log it in MatchXP history
router.post('/match-xp', verifyAdmin, async (req, res) => {
  try {
    const { email, kills, placement, tournamentName } = req.body;

    if (!email || kills === undefined || placement === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // XP logic
    const KILL_XP = 10;
    const PLACEMENT_XP = { 1: 50, 2: 40, 3: 30 };
    const bonusXP = PLACEMENT_XP[placement] || 10;
    const earnedXP = kills * KILL_XP + bonusXP;

    // Find and update user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.xp = (user.xp || 0) + earnedXP;
    user.totalKills = (user.totalKills || 0) + kills;
    user.placementPoints = (user.placementPoints || 0) + placement;
    user.lastUpdated = new Date();

    await user.save();

    // 🧾 Log XP History
    await MatchXP.create({
      user: user._id,
      email: user.email,
      kills,
      placement,
      earnedXP,
      tournamentName: tournamentName || 'Custom Match',
    });

    res.json({
      message: `✅ ${email} received ${earnedXP} XP (${kills} kills, ${placement}th place)`,
      xpGained: earnedXP,
      userId: user._id,
    });
  } catch (err) {
    console.error('XP update error', err);
    res.status(500).json({ message: 'Server error: could not update XP' });
  }
});

module.exports = router;
