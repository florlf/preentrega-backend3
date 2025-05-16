const Pet = require ('../models/Pet.js');

class PetDAO {
  static async bulkCreate(pets) {
    try {
      return await Pet.insertMany(pets);
    } catch (error) {
      throw error;
    }
  }

  static async getAll() {
    try {
      return await Pet.find().lean();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = PetDAO;