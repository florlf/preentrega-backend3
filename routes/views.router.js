const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManager');
const pm = new ProductManager();

router.get('/products', async (req, res) => {
    const products = await pm.getProducts();
    res.render('index', { title: "Productos", products });
});

router.get('/realtimeproducts', async (req, res) => {
  const products = await pm.getProducts();
  res.render('realTimeProducts', { title: "Productos en Tiempo Real", products });
});

module.exports = router;