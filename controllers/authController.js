const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const newUser = new User({
      first_name,
      last_name,
      email,
      password,  // No hace falta hacer hash aquí
    });

    await newUser.save();

    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar el usuario', error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    console.log('Contraseña ingresada:', password);
    console.log('Contraseña hasheada en la DB:', user.password);

    const isMatch = await bcrypt.compare(password, user.password); // Usa await aquí
    console.log('¿Coinciden las contraseñas?', isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ id: user._id }, 'jwt_secret', { expiresIn: '1h' });
    res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 });

    res.render('profile', { user: user });  // Opción 2: renderizar la vista
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

exports.logout = (req, res) => {
  // Eliminar la cookie JWT
  res.clearCookie('jwt');
  // Redirigir a la página de inicio o login después de cerrar sesión
  res.redirect('/login');
};

exports.home = (req, res) => {
  if (req.user) { // Si el usuario está autenticado
    res.render('index', {
      user: req.user,  // Pasa los datos del usuario
      isAuthenticated: true,  // Indica que el usuario está autenticado
    });
  } else {
    res.render('index', {
      isAuthenticated: false,  // Si no está autenticado
    });
  }
};