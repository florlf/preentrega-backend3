const User = require('../models/User');

class UserDAO {
  async findById(id) {
    return await User.findById(id).exec();
  }

  async findOne(query) {
    return await User.findOne(query).exec();
  }

  async getByEmail(email) {
    return await User.findOne({ email }).exec();
  }

  async create(userData) {
    const user = new User(userData);
    return await user.save();
  }
}

module.exports = UserDAO;