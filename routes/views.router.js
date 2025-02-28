const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManager');
const CartManager = require('../managers/CartManager');

const pm = new ProductManager();
const cm = new CartManager();

router.get('/products', async (req, res) => {
  const { limit, page, sort, query } = req.query;
  const result = await pm.getProducts({ limit, page, sort, query });
  res.render('index', { ...result, title: "Productos" });
});

router.get('/products/:pid', async (req, res) => {
  const product = await pm.getProductById(req.params.pid);
  res.render('productDetail', { product, title: "Detalle del Producto" });
});

router.get('/carts/:cid', async (req, res) => {
  const cart = await cm.getCartById(req.params.cid);
  res.render('cart', { products: cart.products, title: "Carrito" });
});

router.get('/realtimeproducts', async (req, res) => {
  try {
    const products = await pm.getProducts({});
    res.render('realTimeProducts', { 
      products: products.payload,
      title: "Productos en Tiempo Real" 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;