const express = require('express');
const router = express.Router();
const passport = require('passport');
const ProductManager = require('../managers/ProductManager');
const CartManager = require('../managers/CartManager');

const pm = new ProductManager();
const cm = new CartManager();

function optionalAuth(req, res, next) {
  console.log("Middleware ejecutándose");
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) {
      console.error('Error en optionalAuth:', err);
    }
    console.log('Usuario desde JWT:', user);
    req.user = user || null;
    next();
  })(req, res, next);
}

router.get('/products', optionalAuth, async (req, res) => {
  console.log('Usuario autenticado:', req.user);
  const { limit, page, sort, query } = req.query;
  const result = await pm.getProducts({ limit, page, sort, query });
  res.render('index', { ...result, title: "Productos", user: req.user || null });
});


router.get('/products/:pid', async (req, res) => {
  const product = await pm.getProductById(req.params.pid);
  res.render('productDetail', { product, title: "Detalle del Producto", user: req.user || null });
});

router.get('/carts/:cid', async (req, res) => {
  const cart = await cm.getCartById(req.params.cid);
  res.render('cart', { products: cart.products, title: "Carrito", user: req.user || null });
});

router.get('/realtimeproducts', async (req, res) => {
  try {
    const products = await pm.getProducts({});
    res.render('realTimeProducts', { 
      products: products.payload,
      title: "Productos en Tiempo Real",
      user: req.user || null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.render('profile', { user: req.user });
});

router.get('/register', (req, res) => {
  res.render('register', { user: req.user || null });
});

router.get('/login', (req, res) => {
  res.render('login', { user: req.user || null });
});

module.exports = router;