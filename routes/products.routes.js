const { Router } = require("express");
const ProductManager = require("../managers/ProductManager");

const router = Router();
const productManager = new ProductManager("./data/productos.json");


router.get("/", async (req, res) => {
  const limit = req.query.limit;
  const products = await productManager.getProducts(limit);
  res.json(products);
});


router.get("/:pid", async (req, res) => {
  const { pid } = req.params;
  const product = await productManager.getProductById(pid);
  if (product) res.json(product);
  else res.status(404).json({ error: "Producto no encontrado" });
});


router.post("/", async (req, res) => {
  const newProduct = req.body;
  try {
    const product = await productManager.addProduct(newProduct);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.put("/:pid", async (req, res) => {
  const { pid } = req.params;
  const updatedData = req.body;
  try {
    const updatedProduct = await productManager.updateProduct(pid, updatedData);
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.delete("/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    await productManager.deleteProduct(pid);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;