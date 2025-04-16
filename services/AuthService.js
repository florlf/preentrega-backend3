const UserRepository = require('../repositories/UserRepository');
const CartRepository = require('../repositories/CartRepository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthService {
  constructor() {
    this.userRepository = new UserRepository();
    this.cartRepository = new CartRepository();
  }

  async register(userData) {
    const existingUser = await this.userRepository.getByEmail(userData.email);
    if (existingUser) {
      throw new Error('El usuario ya existe');
    }

    const newCart = await this.cartRepository.createCart();
    userData.cart = newCart._id;
    return this.userRepository.createUser(userData);
  }

  async login(email, password) {
    const user = await this.userRepository.getByEmail(email);
    if (!user) throw new Error('Usuario no encontrado');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Contraseña incorrecta');

    return jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  }

  async createAdminUser() {
    return this.userRepository.createAdmin();
  }
}

module.exports = AuthService;