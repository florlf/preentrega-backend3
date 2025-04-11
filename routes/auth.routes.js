const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');
const UserDTO = require('../dto/User.dto');

router.post('/login', authController.login);

router.post('/register', authController.register);

router.get('/current', 
  passport.authenticate('jwt', { session: false }), 
  (req, res) => {
    const userDTO = new UserDTO(req.user);
    res.json(userDTO);
  }
);

router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.render('profile', { user: req.user });
});

router.post('/logout', authController.logout);

module.exports = router;