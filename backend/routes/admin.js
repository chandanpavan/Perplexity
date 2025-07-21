const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Tournament = require('../models/Tournament');

// ❗ Change this to your admin email
const ADMIN_EMAIL = 'admin@esportspro.com';

// Middleware: Admin check 🔒
function verifyAdmin(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.email !== ADMIN_EMAIL) {
      return res.status(403).json({ message: 'Admins only' });
    }

    req.user = decoded;
    next(); // ✅ Continue
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

// ✅ READ All Tournaments
router.get('/tournaments', verifyAdmin, async (req, res) => {
  try {
    const tournaments = await Tournament.find().sort({ date: 1 });
    res.status(200).json(tournaments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching tournaments' });
  }
});

// ✅ UPDATE Tournament by ID
router.put('/tournaments/:id', verifyAdmin, async (req, res) => {
  try {
    const tournament = await Tournament.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    res.status(200).json({ message: 'Tournament updated', updated: tournament });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating tournament' });
  }
});

// ✅ DELETE Tournament by ID
router.delete('/tournaments/:id', verifyAdmin, async (req, res) => {
  try {
    const deleted = await Tournament.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    res.status(200).json({ message: 'Tournament deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting tournament' });
  }
});

module.exports = router;
