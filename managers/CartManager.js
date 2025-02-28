const Cart = require('../models/Cart');
const { Types } = require('mongoose');

class CartManager {
  async createCart() {
    const newCart = new Cart({ products: [] });
    return await newCart.save();
  }

  async getCartById(id) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('ID de carrito no válido');
    }
    return await Cart.findById(id)
      .populate('products.product', 'title price')
      .lean();
  }

  async getAllCarts() {
    return await Cart.find().populate('products.product', 'title price').lean();
  }

  async removeProductFromCart(cartId, productId, quantityToRemove = 1) {
    if (!Types.ObjectId.isValid(cartId) || !Types.ObjectId.isValid(productId)) {
      throw new Error('ID de carrito o producto no válido');
    }

    const cart = await Cart.findById(cartId);
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }

    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === productId
    );

    if (productIndex === -1) {
      throw new Error('Producto no encontrado en el carrito');
    }

    if (quantityToRemove >= cart.products[productIndex].quantity) {
      cart.products.splice(productIndex, 1);
    } else {
      cart.products[productIndex].quantity -= quantityToRemove;
    }

    await cart.save();
    return cart;
  }

  async addProductToCart(cartId, productId) {
    if (!Types.ObjectId.isValid(cartId) || !Types.ObjectId.isValid(productId)) {
      throw new Error('ID de carrito o producto no válido');
    }

    let cart = await Cart.findById(cartId);
    if (!cart) {
      cart = new Cart({ _id: cartId, products: [] });
      await cart.save();
    }

    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === productId
    );

    if (productIndex === -1) {
      cart.products.push({ product: productId, quantity: 1 });
    } else {
      cart.products[productIndex].quantity += 1;
    }

    await cart.save();
    return cart;
  }

  async updateCart(cartId, products) {
    if (!Types.ObjectId.isValid(cartId)) {
      throw new Error('ID de carrito no válido');
    }
    const cart = await Cart.findByIdAndUpdate(
      cartId,
      { products },
      { new: true }
    ).populate('products.product', 'title price');
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }
    return cart;
  }

  async updateProductQuantity(cartId, productId, quantity) {
    if (!Types.ObjectId.isValid(cartId) || !Types.ObjectId.isValid(productId)) {
      throw new Error('ID de carrito o producto no válido');
    }
    const cart = await Cart.findById(cartId);
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }
    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === productId
    );
    if (productIndex === -1) {
      throw new Error('Producto no encontrado en el carrito');
    }
    cart.products[productIndex].quantity = quantity;
    await cart.save();
    return cart;
  }

  async clearCart(cartId) {
    if (!Types.ObjectId.isValid(cartId)) {
      throw new Error('ID de carrito no válido');
    }
    const cart = await Cart.findByIdAndUpdate(
      cartId,
      { products: [] },
      { new: true }
    );
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }
    return cart;
  }
}

module.exports = CartManager;