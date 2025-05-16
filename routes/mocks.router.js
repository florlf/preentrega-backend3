const { Router } = require('express');
const { generateMockUsers, generateMockPets } = require('../utils/mockingModule');
const UserService = require('../services/users.service');
const PetService = require('../services/pets.service');

const router = Router();

router.get('/mockingpets', (req, res) => {
  try {
    const mockPets = generateMockPets(50);
    res.json({ status: 'success', payload: mockPets });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

router.get('/mockingusers', (req, res) => {
  try {
    const mockUsers = generateMockUsers(50);
    res.json({ status: 'success', payload: mockUsers });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

router.post('/generateData', async (req, res) => {
  try {
    const { users = 0, pets = 0 } = req.body;
    
    if (isNaN(users)) throw new Error('users debe ser un número');
    if (isNaN(pets)) throw new Error('pets debe ser un número');

    let createdUsers = [];
    if (users > 0) {
      const mockUsers = generateMockUsers(users);
      createdUsers = await UserService.bulkCreate(mockUsers);
    }

    let createdPets = [];
    if (pets > 0) {
      const mockPets = generateMockPets(pets);
      createdPets = await PetService.bulkCreate(mockPets);
    }

    res.json({
      status: 'success',
      users_created: createdUsers.length,
      pets_created: createdPets.length
    });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

module.exports = router;