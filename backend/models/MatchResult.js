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
  participants: [String], // emails
  winner: String, // email of the winner
});

module.exports = mongoose.model('MatchResult', MatchResultSchema);
