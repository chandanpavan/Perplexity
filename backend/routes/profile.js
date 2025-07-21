const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const MatchXP = require('../models/MatchXP');

// 🔐 Auth middleware
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

// ✅ GET /api/profile/me → Basic profile info
router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('email name xp totalKills placementPoints');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (err) {
    console.error('Profile fetch error:', err.message);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

// ✅ GET /api/profile/history → XP history log
router.get('/history', requireAuth, async (req, res) => {
  try {
    const history = await MatchXP.find({ user: req.userId }).sort({ timestamp: -1 });
    res.status(200).json(history);
  } catch (err) {
    console.error('MatchXP fetch error:', err.message);
    res.status(500).json({ message: 'Failed to fetch XP history' });
  }
});

// ✅ PUT /api/profile/update → Update name/email
router.put('/update', requireAuth, async (req, res) => {
  try {
    const { name, email } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.userId,
      { name, email },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'Profile updated', user: updated });
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

    res.json({ message: 'Password updated' });
  } catch (err) {
    console.error('Password update error:', err.message);
    res.status(500).json({ message: 'Error changing password' });
  }
});

// ✅ DELETE /api/profile/delete → Delete account + XP logs
router.delete('/delete', requireAuth, async (req, res) => {
  try {
    await MatchXP.deleteMany({ user: req.userId });

    const deleted = await User.findByIdAndDelete(req.userId);
    if (!deleted) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (err) {
    console.error('Account delete error:', err.message);
    res.status(500).json({ message: 'Failed to delete account' });
  }
});

module.exports = router;
