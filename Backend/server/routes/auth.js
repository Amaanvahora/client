const express = require('express');
const passport = require('passport');
const User = require('../models/User');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = new User({ username, password });
    await user.save();
    res.status(201).send('User registered');
  } catch (err) {
    res.status(400).send('Error registering user');
  }
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.send('Logged in');
});

router.get('/logout', (req, res) => {
  req.logout();
  res.send('Logged out');
});

module.exports = router;
