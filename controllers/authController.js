const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserRepository = require('../repositories/UserRepository');
const CartRepository = require('../repositories/CartRepository');
const UserDTO = require('../dto/User.dto');

const userRepository = new UserRepository();
const cartRepository = new CartRepository();

const createAdminUser = async () => {
  try {
    const adminExists = await userRepository.getByEmail('admin@admin.com');
    if (!adminExists) {
      const adminCart = await cartRepository.createCart();
      const hashedPassword = await bcrypt.hash('admin', 10);
      await userRepository.create({
        first_name: 'Admin',
        last_name: 'Admin',
        email: 'admin@admin.com',
        password: hashedPassword,
        cart: adminCart._id,
        role: 'admin'
      });
      console.log('✅ Admin creado');
    }
  } catch (error) {
    console.error('Error creando admin:', error);
    process.exit(1);
  }
};

createAdminUser();

exports.register = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    const existingUser = await userRepository.getByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const newCart = await cartRepository.createCart();
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userRepository.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      cart: newCart._id,
      role: 'user'
    });

    res.status(201).json({ 
      success: true,
      message: 'Usuario registrado con éxito',
      user: {
        id: newUser._id,
        email: newUser.email,
        first_name: newUser.first_name
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al registrar el usuario',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userRepository.getByEmail(email);
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