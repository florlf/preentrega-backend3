const { Router } = require("express");
const CartManager = require("../managers/CartManager");

const router = Router();
const cartManager = new CartManager("./data/carrito.json");

router.post("/", async (req, res) => {
  const newCart = await cartManager.createCart();
  res.status(201).json(newCart);
});


router.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  const cartId = Number(cid);
  
  const cart = await cartManager.getCartById(cartId);
  
  if (cart) res.json(cart);
  else res.status(404).json({ error: "Carrito no encontrado" });
});


router.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const cartId = Number(cid);
  const productId = Number(pid);

  try {
    const updatedCart = await cartManager.addProductToCart(cartId, productId);
    res.json(updatedCart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.delete("/:cid", async (req, res) => {
  const { cid } = req.params;

  try {
    const result = await cartManager.deleteCart(cid);
    if (result) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Carrito no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el carrito" });
  }
});


module.exports = router;