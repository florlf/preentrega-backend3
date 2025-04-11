const { Router } = require('express');
const passport = require('passport');
const CartManager = require('../managers/CartManager');
const { passportCall, authorization } = require('../middlewares/auth.middleware');

const router = Router();
const cartManager = new CartManager();

// Modificar la ruta /mycart para renderizar la vista
router.get('/mycart',
  passport.authenticate('jwt', { session: false, failureRedirect: '/login' }),
  async (req, res) => {
    try {
      const cart = await cartManager.getCartById(req.user.cart);
      
      // Renderizar la vista cart.handlebars con los datos necesarios
      res.render('cart', {
        cart: {
          ...cart,
          _id: cart._id.toString(),
          products: cart.products.map(item => ({
            ...item,
            product: {
              ...item.product,
              _id: item.product._id.toString()
            }
          }))
        },
        user: req.user,
        cartId: req.user.cart.toString()
      });
      
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.post('/', async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    console.error('Error al crear carrito:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/:cid', async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await cartManager.getCartById(cid);
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    res.json(cart);
  } catch (error) {
    console.error('Error al obtener carrito:', error);
    res.status(400).json({ error: error.message });
  }
});


router.post('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const updatedCart = await cartManager.addProductToCart(cid, pid);
    res.json(updatedCart);
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
    res.status(400).json({ error: error.message });
  }
});


router.put('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    const updatedCart = await cartManager.updateProductQuantity(cid, pid, quantity);
    res.json(updatedCart);
  } catch (error) {
    console.error('Error al actualizar cantidad del producto:', error);
    res.status(400).json({ error: error.message });
  }
});

router.put('/:cid', async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body;

  try {
    const updatedCart = await cartManager.updateCart(cid, products);
    res.json(updatedCart);
  } catch (error) {
    console.error('Error al actualizar carrito:', error);
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.query;

  try {
    const updatedCart = await cartManager.removeProductFromCart(
      cid,
      pid,
      quantity ? parseInt(quantity) : 1
    );
    res.json(updatedCart);
  } catch (error) {
    console.error('Error al eliminar producto del carrito:', error);
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:cid', async (req, res) => {
  const { cid } = req.params;

  try {
    const updatedCart = await cartManager.clearCart(cid);
    res.json(updatedCart);
  } catch (error) {
    console.error('Error al vaciar carrito:', error);
    res.status(400).json({ error: error.message });
  }
});

router.post('/:cid/purchase', 
  passportCall('jwt'), 
  async (req, res) => {
    try {
      const { cid } = req.params;
      const user = req.user;
      
      const result = await cartManager.purchaseCart(cid, user.email);
      
      res.json({
        status: 'success',
        ticket: result.ticket,
        productsNotPurchased: result.productsNotPurchased,
        updatedCart: result.updatedCart
      });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
);

module.exports = router;