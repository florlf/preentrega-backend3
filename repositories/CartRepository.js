const CartDAO = require('../dao/CartDAO');
const ProductDAO = require('../dao/ProductDAO');
const TicketDAO = require('../dao/TicketDAO');

class CartRepository {
  constructor() {
    this.cartDAO = new CartDAO();
    this.productDAO = new ProductDAO();
    this.ticketDAO = new TicketDAO();
  }

  async createCart() {
    return this.cartDAO.createCart();
  }

  async getCartById(id) {
    return this.cartDAO.getCartById(id);
  }

  async getAllCarts() {
    return this.cartDAO.getAllCarts();
  }

  async removeProductFromCart(cartId, productId, quantityToRemove = 1) {
    return this.cartDAO.removeProductFromCart(cartId, productId, quantityToRemove);
  }

  async addProductToCart(cartId, productId) {
    return this.cartDAO.addProductToCart(cartId, productId);
  }

  async updateCart(cartId, products) {
    return this.cartDAO.updateCart(cartId, products);
  }

  async updateProductQuantity(cartId, productId, quantity) {
    return this.cartDAO.updateProductQuantity(cartId, productId, quantity);
  }

  async clearCart(cartId) {
    return this.cartDAO.clearCart(cartId);
  }

  async purchaseCart(cartId, userEmail) {
    const cart = await this.cartDAO.getCartById(cartId);
    
    if (!cart.products || cart.products.length === 0) {
      throw new Error('No hay productos en el carrito para comprar');
    }
    
    const productsToPurchase = [];
    const productsNotPurchased = [];
    let totalAmount = 0;

    for (const item of cart.products) {
      const product = await this.productDAO.getProductById(item.product._id);
      if (!product) {
        productsNotPurchased.push(item.product._id);
        continue;
      }

      if (product.stock >= item.quantity) {
        product.stock -= item.quantity;
        await this.productDAO.updateProductStock(product._id, product.stock);
        productsToPurchase.push({
          product: item.product._id,
          quantity: item.quantity,
          price: product.price
        });
        totalAmount += product.price * item.quantity;
      } else {
        productsNotPurchased.push(item.product._id.toString());
      }
    }

    const ticket = await this.ticketDAO.create({
      code: `TKT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      purchase_datetime: new Date(),
      amount: totalAmount,
      purchaser: userEmail,
      products: productsToPurchase
    });

    await this.cartDAO.updateCart(cartId, {
      products: cart.products.filter(item => 
        productsNotPurchased.includes(item.product._id.toString())
      )
    });

    return { ticket, productsNotPurchased };
  }
}

module.exports = CartRepository;