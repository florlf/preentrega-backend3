const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');

router.post('/login', authController.login);

router.post('/register', authController.register);

// Asegúrate de que el usuario esté autenticado usando JWT
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json(req.user);  // Devolvemos los datos del usuario autenticado
});

router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.render('profile', { user: req.user });
});

router.post('/logout', authController.logout);

module.exports = router;