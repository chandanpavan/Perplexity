const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 🔐 GET /api/profile/me → Authenticated user's XP and email
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    const user = await User.findOne({ email }).select('email xp');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user); // e.g. { email: 'user@site.com', xp: 120 }
  } catch (err) {
    console.error('Profile fetch error:', err.message);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

module.exports = router;
