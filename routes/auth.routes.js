const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');

router.post('/login', authController.login);

router.post('/register', authController.register);

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ user: req.user });
});

router.post('/logout', authController.logout);

module.exports = router;