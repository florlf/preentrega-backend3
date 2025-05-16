const PetDAO = require ('../dao/pets.dao.js');

class PetService {
  static async bulkCreate(pets) {
    try {
      return await PetDAO.bulkCreate(pets);
    } catch (error) {
      throw new Error(`Error creando mascotas: ${error.message}`);
    }
  }

  static async getAll() {
    try {
      return await PetDAO.getAll();
    } catch (error) {
      throw new Error(`Error obteniendo mascotas: ${error.message}`);
    }
  }
}

module.exports = PetService;