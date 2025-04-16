const CartRepository = require('../repositories/CartRepository');
const ProductRepository = require('../repositories/ProductRepository');
const TicketRepository = require('../repositories/TicketRepository');

class CartService {
  constructor() {
    this.cartRepository = new CartRepository();
    this.productRepository = new ProductRepository();
    this.ticketRepository = new TicketRepository();
  }

  async createCart() {
    return this.cartRepository.createCart();
  }

  async getCartById(id) {
    return this.cartRepository.getCartById(id);
  }

  async getAllCarts() {
    return this.cartRepository.getAllCarts();
  }

  async removeProductFromCart(cartId, productId, quantityToRemove = 1) {
    return this.cartRepository.removeProductFromCart(cartId, productId, quantityToRemove);
  }

  async addProductToCart(cartId, productId) {
    const product = await this.productRepository.getProductById(productId);
    if (!product) throw new Error('Producto no encontrado');
    
    let cart = await this.cartRepository.getCartById(cartId);
    if (!cart) {
      cart = await this.cartRepository.createCart();
    }

    const cartProduct = cart.products.find(p => p.product.toString() === productId);
    if (cartProduct) {
      if (cartProduct.quantity + 1 > product.stock) {
        throw new Error(`No hay suficiente stock. Disponible: ${product.stock}`);
      }
      cartProduct.quantity += 1;
    } else {
      if (product.stock < 1) throw new Error('Producto sin stock disponible');
      cart.products.push({ product: productId, quantity: 1 });
    }

    return this.cartRepository.updateCart(cart._id, cart);
  }

  async updateCart(cartId, products) {
    return this.cartRepository.updateCart(cartId, products);
  }

  async updateProductQuantity(cartId, productId, quantity) {
    return this.cartRepository.updateProductQuantity(cartId, productId, quantity);
  }

  async clearCart(cartId) {
    return this.cartRepository.clearCart(cartId);
  }

  async purchaseCart(cartId, userEmail) {
    const cart = await this.cartRepository.getCartById(cartId);
    
    if (!cart.products || cart.products.length === 0) {
      throw new Error('No hay productos en el carrito para comprar');
    }
    
    const productsToPurchase = [];
    const productsNotPurchased = [];
    let totalAmount = 0;

    for (const item of cart.products) {
      const product = await this.productRepository.getProductById(item.product._id);
      if (!product) {
        productsNotPurchased.push(item.product._id);
        continue;
      }

      if (product.stock >= item.quantity) {
        product.stock -= item.quantity;
        await this.productRepository.updateProductStock(product._id, product.stock);
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

    const ticket = await this.ticketRepository.createTicket({
      code: `TKT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      purchase_datetime: new Date(),
      amount: totalAmount,
      purchaser: userEmail,
      products: productsToPurchase
    });

    await this.cartRepository.updateCart(cartId, {
      products: cart.products.filter(item => 
        productsNotPurchased.includes(item.product._id.toString())
      )
    });

    return { ticket, productsNotPurchased };
  }
}

module.exports = CartService;