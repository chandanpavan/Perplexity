const mongoose = require('mongoose');

const MatchXPSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  email: String,
  tournamentName: String,
  kills: Number,
  placement: Number,
  earnedXP: Number,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('MatchXP', MatchXPSchema);
