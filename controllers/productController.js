const ProductService = require('../services/ProductService');
const productService = new ProductService();

exports.getProducts = async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    const result = await productService.getProducts({ limit, page, sort, query });
    
    const user = req.user ? { 
      ...req.user.toObject(), 
      cart: req.user.cart._id ? req.user.cart._id.toString() : req.user.cart.toString(),
      role: req.user.role.toString()
    } : null;

    res.render('index', {
      payload: result.payload,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.prevLink,
      nextLink: result.nextLink,
      user: user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  const product = await productService.getProductById(req.params.pid);
  if (product) res.json(product);
  else res.status(404).json({ error: 'Producto no encontrado' });
};