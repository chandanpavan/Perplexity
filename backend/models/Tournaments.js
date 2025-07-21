const mongoose = require('mongoose');

const TournamentSchema = new mongoose.Schema({
  game: String,
  date: String,
  time: String,
  reward: String,
  status: String,
  participants: [{ type: String }] // emails or user IDs
});

module.exports = mongoose.model('Tournament', TournamentSchema);
