const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Squad = require('../models/Squad');
const User = require('../models/User');

// Auth middleware
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not logged in' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// ✅ Create Squad
router.post('/create', auth, async (req, res) => {
  const { name, description } = req.body;

  const existing = await Squad.findOne({ leader: req.userId });
  if (existing) return res.status(400).json({ message: 'You already have a squad' });

  const squad = await Squad.create({
    name,
    description,
    leader: req.userId,
    members: [req.userId],
  });

  res.json({ message: 'Squad created', squad });
});

// ✅ Get all squad info (for profile/dashboard)
router.get('/my', auth, async (req, res) => {
  const squad = await Squad.findOne({ members: req.userId })
    .populate('leader', 'email')
    .populate('members', 'email');

  if (!squad) return res.status(404).json({ message: 'No squad found' });
  res.json(squad);
});

// ✅ Request to join a squad
router.post('/request', auth, async (req, res) => {
  const { squadId } = req.body;
  const squad = await Squad.findById(squadId);
  if (!squad) return res.status(404).json({ message: 'Squad not found' });

  if (squad.pendingRequests.includes(req.userId) || squad.members.includes(req.userId))
    return res.status(400).json({ message: 'Already requested or in squad' });

  squad.pendingRequests.push(req.userId);
  await squad.save();

  res.json({ message: 'Join request sent' });
});

// ✅ Accept join request (by leader)
router.post('/manage', auth, async (req, res) => {
  const { squadId, userId, action } = req.body;

  const squad = await Squad.findById(squadId);
  if (!squad || squad.leader.toString() !== req.userId)
    return res.status(403).json({ message: 'You are not the squad leader' });

  if (action === 'accept') {
    squad.members.push(userId);
  }
  squad.pendingRequests = squad.pendingRequests.filter(
    (id) => id.toString() !== userId
  );

  await squad.save();
  res.json({ message: `Request ${action}ed` });
});
