const { Router } = require('express');
const ProductManager = require('../managers/ProductManager');
const { passportCall, authorization } = require('../middlewares/auth.middleware');

const router = Router();
const productManager = new ProductManager();

router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    const product = await productManager.getProducts({ limit, page, sort, query });
    const user = req.user ? { 
      ...req.user.toObject(), 
      cart: req.user.cart._id ? req.user.cart._id.toString() : req.user.cart.toString(),
      role: req.user.role.toString()
    } : null;

    res.render('index', {
      payload: product.payload,
      hasPrevPage: product.hasPrevPage,
      hasNextPage: product.hasNextPage,
      prevLink: product.prevLink,
      nextLink: product.nextLink,
      user: user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/:pid', async (req, res) => {
  const product = await productManager.getProductById(req.params.pid);
  if (product) res.json(product);
  else res.status(404).json({ error: 'Producto no encontrado' });
});


router.post('/', 
  passportCall('jwt'), 
  authorization(['admin']),
  async (req, res) => {
  try {
    const productData = req.body;
    const newProduct = await productManager.addProduct(productData);
    
    const io = req.app.get('io');
    const result = await productManager.getProducts({});
    io.emit('updateProducts', result.payload);
    
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:pid', 
  passportCall('jwt'), 
  authorization(['admin']),
  async (req, res) => {
  const { pid } = req.params;
  const updatedData = req.body;
  try {
    const updatedProduct = await productManager.updateProduct(pid, updatedData);
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:pid', 
  passportCall('jwt'), 
  authorization(['admin']),
  async (req, res) => {
  try {
    await productManager.deleteProduct(req.params.pid);
    
    const io = req.app.get('io');
    const result = await productManager.getProducts({});
    io.emit('updateProducts', result.payload);
    
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;