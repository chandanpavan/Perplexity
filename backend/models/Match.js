const mongoose = require('mongoose');

const MatchResultSchema = new mongoose.Schema({
  tournament: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  winner: {
    type: String,
    required: true,
  },
  participants: [String], // Optional: still useful for quick search
  results: [
    {
      email: { type: String, required: true },
      kills: { type: Number, default: 0 },
      placement: { type: Number, default: 0 },
      earnedXP: { type: Number, default: 0 },
    }
  ],
});

module.exports = mongoose.model('MatchResult', MatchResultSchema);
