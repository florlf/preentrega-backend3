const { Router } = require('express');
const CartManager = require('../managers/CartManager');

const router = Router();
const cartManager = new CartManager();

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

module.exports = router;