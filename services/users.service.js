const UserDAO = require ('../dao/users.dao.js');

class UserService {
  static async bulkCreate(users) {
    try {
      return await UserDAO.bulkCreate(users);
    } catch (error) {
      throw new Error(`Error creando usuarios: ${error.message}`);
    }
  }

  static async getAll() {
    try {
      return await UserDAO.getAll();
    } catch (error) {
      throw new Error(`Error obteniendo usuarios: ${error.message}`);
    }
  }
}

module.exports = UserService;