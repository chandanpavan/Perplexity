const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  xp: {
    type: Number,
    default: 0   // 🎯 XP field for leaderboard
  },
  joinedTournaments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tournament'
    }
  ]
});

module.exports = mongoose.model('User', UserSchema);
