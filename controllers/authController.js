const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const Cart = require('../models/Cart');
const UserDTO = require('../dto/User.dto');

// Función para crear el admin si no existe
const createAdminUser = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@admin.com' });
    if (!adminExists) {
      const adminCart = new Cart({ products: [] });
      await adminCart.save();
      
      // Guardar contraseña en texto plano (el hook la hasheará)
      const adminUser = new User({
        first_name: 'Admin',
        last_name: 'Admin',
        email: 'admin@admin.com',
        password: 'admin', // ← Texto plano
        cart: adminCart._id,
        role: 'admin'
      });
      
      await adminUser.save();
      console.log('✅ Admin creado');
    }
  } catch (error) {
    console.error('Error creando admin:', error);
    process.exit(1);
  }
};

// Llama a esta función cuando se inicie el servidor
createAdminUser();

exports.register = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Crear carrito primero
    const newCart = new Cart({ products: [] });
    await newCart.save();

    // Crear usuario con el carrito asignado
    const newUser = new User({
      first_name,
      last_name,
      email,
      password,
      cart: newCart._id // Asignar el carrito creado
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