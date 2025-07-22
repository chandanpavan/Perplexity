const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Squad = require('../models/Squad');
const User = require('../models/User');

// ✅ Auth Middleware
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// ✅ POST /api/squads/create → Create a squad
router.post('/create', requireAuth, async (req, res) => {
  try {
    const { name, description } = req.body;

    // One squad per leader
    const existing = await Squad.findOne({ leader: req.userId });
    if (existing) return res.status(400).json({ message: 'You already have a squad' });

    const squad = await Squad.create({
      name,
      description,
      leader: req.userId,
      members: [req.userId],
    });

    res.json({ message: 'Squad created', squad });
  } catch (err) {
    res.status(500).json({ message: 'Error creating squad' });
  }
});

// ✅ GET /api/squads/my → Get user's squad
router.get('/my', requireAuth, async (req, res) => {
  try {
    const squad = await Squad.findOne({
      $or: [
        { leader: req.userId },
        { members: req.userId }
      ]
    })
      .populate('leader', 'email name')
      .populate('members', 'email name');

    if (!squad) {
      return res.status(404).json({ message: 'You are not part of any squad yet.' });
    }

    res.status(200).json(squad);
  } catch (err) {
    console.error('Squad fetch error:', err.message);
    res.status(500).json({ message: 'Failed to fetch squad info' });
  }
});

// ✅ POST /api/squads/request → Request to join a squad
router.post('/request', requireAuth, async (req, res) => {
  try {
    const { squadId } = req.body;

    const squad = await Squad.findById(squadId);
    if (!squad) return res.status(404).json({ message: 'Squad not found' });

    if (
      squad.pendingRequests.includes(req.userId) ||
      squad.members.includes(req.userId)
    ) {
      return res.status(400).json({ message: 'Already requested or in squad' });
    }

    squad.pendingRequests.push(req.userId);
    await squad.save();

    res.json({ message: 'Join request sent' });
  } catch (err) {
    res.status(500).json({ message: 'Error sending join request' });
  }
});

// ✅ POST /api/squads/manage → Accept or reject requests
router.post('/manage', requireAuth, async (req, res) => {
  try {
    const { squadId, userId, action } = req.body;

    const squad = await Squad.findById(squadId);
    if (!squad || squad.leader.toString() !== req.userId) {
      return res.status(403).json({ message: 'You are not the squad leader' });
    }

    if (action === 'accept') {
      if (!squad.members.includes(userId)) {
        squad.members.push(userId);
      }
    }

    squad.pendingRequests = squad.pendingRequests.filter(
      (id) => id.toString() !== userId
    );

    await squad.save();
    res.json({ message: `Request ${action}ed` });
  } catch (err) {
    console.error('Manage error:', err.message);
    res.status(500).json({ message: 'Error managing request' });
  }
});

module.exports = router;
