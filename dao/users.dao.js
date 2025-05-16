const User = require ('../models/User.js');

class UserDAO {
  static async bulkCreate(users) {
    try {
      return await User.insertMany(users);
    } catch (error) {
      throw error;
    }
  }

  static async getAll() {
    try {
      return await User.find().lean();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserDAO;