const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const FriendRequest = require('../models/FriendRequest');

// ✅ Middleware to get logged-in user
const requireAuth = (req, res, next) => {
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

// ✅ GET /api/friends/search?query=...
router.get('/search', requireAuth, async (req, res) => {
  const query = req.query.query;
  if (!query) return res.json([]);

  const users = await User.find({
    email: { $regex: query, $options: 'i' },
    _id: { $ne: req.userId },
  }).select('email');

  res.json(users);
});

// ✅ POST /api/friends/request
router.post('/request', requireAuth, async (req, res) => {
  const { toEmail } = req.body;
  const toUser = await User.findOne({ email: toEmail });
  if (!toUser) return res.status(404).json({ message: 'User not found' });

  const existing = await FriendRequest.findOne({
    from: req.userId,
    to: toUser._id,
    status: 'pending',
  });
  if (existing) return res.status(400).json({ message: 'Already sent' });

  await FriendRequest.create({
    from: req.userId,
    to: toUser._id,
  });

  res.json({ message: 'Friend request sent ✅' });
});

// ✅ GET /api/friends/requests
router.get('/requests', requireAuth, async (req, res) => {
  const requests = await FriendRequest.find({ to: req.userId, status: 'pending' })
    .populate('from', 'email')
    .sort({ createdAt: -1 });

  res.json(requests);
});

// ✅ POST /api/friends/respond
router.post('/respond', requireAuth, async (req, res) => {
  const { requestId, action } = req.body;

  const request = await FriendRequest.findById(requestId);
  if (!request || request.to.toString() !== req.userId) return res.status(404).json({ message: 'Request not found' });

  if (!['accepted', 'rejected'].includes(action))
    return res.status(400).json({ message: 'Invalid action' });

  request.status = action;
  await request.save();

  res.json({ message: `Request ${action}` });
});

// ✅ GET /api/friends/list
router.get('/list', requireAuth, async (req, res) => {
  const accepted = await FriendRequest.find({
    $or: [{ from: req.userId }, { to: req.userId }],
    status: 'accepted',
  }).populate('from to', 'email');

  const friends = accepted.map((request) =>
    request.from._id.toString() === req.userId ? request.to : request.from
  );

  res.json(friends);
});

module.exports = router;
