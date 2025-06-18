const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');
const UserDTO = require('../dto/User.dto');

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso
 *       401:
 *         description: Credenciales inválidas
 */

router.post('/login', authController.login);

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Registrar nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Error en los datos
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /current:
 *   get:
 *     summary: Obtener usuario actual
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Usuario actual
 *       401:
 *         description: No autorizado
 */
router.get('/current', 
  passport.authenticate('jwt', { session: false }), 
  (req, res) => {
    const userDTO = new UserDTO(req.user);
    res.json(userDTO);
  }
);

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Renderiza la vista de perfil del usuario
 *     tags: [Usuarios]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Vista renderizada correctamente
 *       401:
 *         description: No autorizado
 */
router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.render('profile', { user: req.user });
});

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Cerrar sesión
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Logout exitoso
 */
router.post('/logout', authController.logout);

module.exports = router;