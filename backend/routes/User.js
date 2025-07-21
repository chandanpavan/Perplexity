const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Tournament = require('../models/Tournament');
const User = require('../models/User');

// ✅ GET /api/users/:email/joined - Get all tournaments this user has joined
router.get('/:email/joined', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const requestedEmail = req.params.email;

    // Only the logged-in user can see their own tournaments
    if (decoded.email !== requestedEmail) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    const joinedTournaments = await Tournament.find({
      participants: requestedEmail,
    });

    res.status(200).json(joinedTournaments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error getting joined tournaments' });
  }
});


// ✅ POST /api/users/:email/leave/:id - Leave a tournament and deduct XP
router.post('/:email/leave/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    // Ensure user is modifying their own data
    if (email !== req.params.email) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const tournamentId = req.params.id;
    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) return res.status(404).json({ message: 'Tournament not found' });

    // Remove user from tournament participants
    tournament.participants = tournament.participants.filter(
      (participantEmail) => participantEmail !== email
    );
    await tournament.save();

    // 🧠 Now update user's profile
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const leftBefore = user.joinedTournaments.includes(tournamentId);

    // Remove tournament from user's joined list
    user.joinedTournaments = user.joinedTournaments.filter(
      (id) => id.toString() !== tournamentId.toString()
    );

    // Deduct XP (if they had joined before)
    if (leftBefore) {
      user.xp = Math.max(0, user.xp - 10); // 🧠 Minimum 0 XP
    }

    await user.save();

    res.status(200).json({ message: 'You left the tournament. XP deducted.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while leaving tournament' });
  }
});

module.exports = router;
