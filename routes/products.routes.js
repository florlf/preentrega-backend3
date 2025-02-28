const { Router } = require('express');
const ProductManager = require('../managers/ProductManager');

const router = Router();
const productManager = new ProductManager();

router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    
    const result = await productManager.getProducts({
      limit,
      page,
      sort,
      query
    });

    res.render('products', {
      ...result,
      sort: sort || '',
      query: query || '',
      cartId: req.session.cartId
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

// POST corregido
router.post('/', async (req, res) => {
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

router.put('/:pid', async (req, res) => {
  const { pid } = req.params;
  const updatedData = req.body;
  try {
    const updatedProduct = await productManager.updateProduct(pid, updatedData);
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE corregido
router.delete('/:pid', async (req, res) => {
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