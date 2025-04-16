const UserDAO = require('../dao/UserDAO');
const CartDAO = require('../dao/CartDAO');

class UserRepository {
  constructor() {
    this.dao = new UserDAO();
    this.cartDAO = new CartDAO();
  }

  async create(userData) {
    return this.dao.create(userData);
  }

  async getByEmail(email) {
    return this.dao.getByEmail(email);
  }

  async getById(id) {
    return this.dao.findById(id);
  }
}

module.exports = UserRepository;