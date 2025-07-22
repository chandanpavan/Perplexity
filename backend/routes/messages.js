const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Message = require('../models/Message');
const User = require('../models/User');

// ✅ Auth middleware
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not logged in' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// 🧑‍🤝‍🧑 Get chat with a friend
router.get('/dm/:friendId', requireAuth, async (req, res) => {
  const { userId } = req;
  const { friendId } = req.params;

  const messages = await Message.find({
    $or: [
      { senderId: userId, receiverId: friendId },
      { senderId: friendId, receiverId: userId },
    ],
  }).sort({ timestamp: 1 });

  res.json(messages);
});

// 🛡 Squad conversation
router.get('/squad/:squadId', requireAuth, async (req, res) => {
  const messages = await Message.find({ squadId: req.params.squadId })
    .sort({ timestamp: 1 });

  res.json(messages);
});

module.exports = router;
    