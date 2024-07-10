const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// Create a new event
router.post('/', async (req, res) => {
  const { title, date, time, description } = req.body;
  try {
    const event = new Event({ title, date, time, description });
    await event.save();
    res.status(201).send(event);
  } catch (err) {
    res.status(400).send('Error creating event');
  }
});

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.send(events);
  } catch (err) {
    res.status(500).send('Error fetching events');
  }
});

// Update an event
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, date, time, description } = req.body;
  try {
    const event = await Event.findByIdAndUpdate(id, { title, date, time, description }, { new: true });
    res.send(event);
  } catch (err) {
    res.status(400).send('Error updating event');
  }
});

// Delete an event
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Event.findByIdAndDelete(id);
    res.send('Event deleted');
  } catch (err) {
    res.status(400).send('Error deleting event');
  }
});

module.exports = router;
