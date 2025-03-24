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
      password,
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

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { 
        id: user._id,
        role: user.role
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );
    res.cookie('jwt', token, { 
      httpOnly: true, 
      maxAge: 3600000,
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production'
    });


    res.redirect('/products');
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

exports.logout = (req, res) => {

  res.clearCookie('jwt');

  res.redirect('/login');
};

exports.home = (req, res) => {
  if (req.user) {
    res.render('index', {
      user: req.user,
      isAuthenticated: true,
    });
  } else {
    res.render('index', {
      isAuthenticated: false,
    });
  }
};