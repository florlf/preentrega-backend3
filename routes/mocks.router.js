const express = require('express');
const router = express.Router();
const { generateMockUsers } = require('../mocking/users.mock');
const { generateMockProducts } = require('../mocking/products.mock');
const User = require('../models/User');
const Product = require('../models/Product');

router.post('/:users/:products', async (req, res) => {
  try {
    const users = parseInt(req.params.users);
    const products = parseInt(req.params.products);

    if (isNaN(users) || isNaN(products)) {
      return res.status(400).json({ error: 'Los parámetros deben ser números' });
    }

    const mockUsers = generateMockUsers(users);
    await User.insertMany(mockUsers);

    const mockProducts = generateMockProducts(products);
    await Product.insertMany(mockProducts);

    res.json({
      status: 'success',
      users: users,
      products: products
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      status: 'error',
      error: error.message
    });
  }
});

module.exports = router;