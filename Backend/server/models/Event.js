// server/models/Event.js
const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: String,
  date: String,
  time: String,
  description: String,
});

module.exports = mongoose.model('Event', EventSchema);
