const express = require('express');
const router = express.Router();

router.get('/dashboard', (req, res) => {
  if (req.isAuthenticated()) {
    res.send('Welcome to your dashboard');
  } else {
    res.status(401).send('You are not authenticated');
  }
});

module.exports = router;
