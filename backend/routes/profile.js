const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const MatchXP = require('../models/MatchXP');

// 🔐 Middleware: Auth check using JWT
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userEmail = decoded.email;
    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// 🎯 Level/Badge based on XP
const getLevel = (xp) => Math.floor(xp / 100);
const getBadge = (level) => {
  if (level >= 10) return '🏅 Pro Legend';
  if (level >= 5) return '🥈 Battle Master';
  if (level >= 2) return '🥉 Rising Star';
  return '🎮 Rookie';
};

// ✅ GET /api/profile/me
router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select(
      'email name xp totalKills placementPoints'
    );

    if (!user) return res.status(404).json({ message: 'User not found' });

    const level = getLevel(user.xp);
    const badge = getBadge(level);

    res.status(200).json({
      ...user.toObject(),
      level,
      badge,
    });
  } catch (err) {
    console.error('Profile fetch error:', err.message);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

// ✅ GET /api/profile/history → Match XP history
// ✅ GET /api/profile/history?limit=5&from=2024-07-01&to=2024-07-21
router.get('/history', requireAuth, async (req, res) => {
  try {
    const { limit = 10, from, to } = req.query;

    const query = { user: req.userId };

    // Optional date filters
    if (from || to) {
      query.timestamp = {};
      if (from) query.timestamp.$gte = new Date(from);
      if (to) query.timestamp.$lte = new Date(to);
    }

    const history = await MatchXP.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    res.status(200).json(history);
  } catch (err) {
    console.error('MatchXP fetch error:', err.message);
    res.status(500).json({ message: 'Failed to fetch XP history' });
  }
});


// ✅ PUT /api/profile/update → Edit profile details
router.put('/update', requireAuth, async (req, res) => {
  try {
    const { name, email } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.userId,
      { name, email },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({
      message: 'Profile updated',
      user: {
        email: updated.email,
        name: updated.name,
      },
    });
  } catch (err) {
    console.error('Profile update error:', err.message);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// ✅ PUT /api/profile/change-password
router.put('/change-password', requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(401).json({ message: 'Current password is incorrect' });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPassword, salt);
    user.password = hashed;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Password change error:', err.message);
    res.status(500).json({ message: 'Error changing password' });
  }
});

// ✅ DELETE /api/profile/delete → Account deletion with password confirmation
router.delete('/delete', requireAuth, async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) return res.status(400).json({ message: 'Password required' });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });

    await MatchXP.deleteMany({ user: req.userId }); // delete XP logs
    await User.findByIdAndDelete(req.userId); // delete user

    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (err) {
    console.error('Account deletion error:', err.message);
    res.status(500).json({ message: 'Failed to delete account' });
  }
});

module.exports = router;
