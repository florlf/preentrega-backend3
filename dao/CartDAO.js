const Cart = require('../models/Cart');
const { Types } = require('mongoose');

class CartDAO {
  async createCart() {
    const newCart = new Cart({ products: [] });
    return await newCart.save();
  }

  async getCartById(id) {
    if (!Types.ObjectId.isValid(id)) throw new Error('ID de carrito no válido');
    return await Cart.findById(id).populate('products.product', 'title price').lean();
  }

  async getAllCarts() {
    return await Cart.find().populate('products.product', 'title price').lean();
  }

  async removeProductFromCart(cartId, productId, quantityToRemove = 1) {
    if (!Types.ObjectId.isValid(cartId) || !Types.ObjectId.isValid(productId)) {
      throw new Error('ID de carrito o producto no válido');
    }

    const cart = await Cart.findById(cartId);
    if (!cart) throw new Error('Carrito no encontrado');

    const productIndex = cart.products.findIndex(p => p.product.toString() === productId);
    if (productIndex === -1) throw new Error('Producto no encontrado en el carrito');

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

    const product = await Product.findById(productId);
    if (!product) throw new Error('Producto no encontrado');
    
    let cart = await Cart.findById(cartId);
    if (!cart) {
      cart = new Cart({ _id: cartId, products: [] });
      await cart.save();
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

    await cart.save();
    return cart;
  }

  async updateCart(cartId, products) {
    if (!Types.ObjectId.isValid(cartId)) throw new Error('ID de carrito no válido');
    const cart = await Cart.findByIdAndUpdate(
      cartId,
      { products },
      { new: true }
    ).populate('products.product', 'title price');
    if (!cart) throw new Error('Carrito no encontrado');
    return cart;
  }

  async updateProductQuantity(cartId, productId, quantity) {
    if (!Types.ObjectId.isValid(cartId) || !Types.ObjectId.isValid(productId)) {
      throw new Error('ID de carrito o producto no válido');
    }
    const cart = await Cart.findById(cartId);
    if (!cart) throw new Error('Carrito no encontrado');
    
    const productIndex = cart.products.findIndex(p => p.product.toString() === productId);
    if (productIndex === -1) throw new Error('Producto no encontrado en el carrito');
    
    cart.products[productIndex].quantity = quantity;
    await cart.save();
    return cart;
  }

  async clearCart(cartId) {
    if (!Types.ObjectId.isValid(cartId)) throw new Error('ID de carrito no válido');
    const cart = await Cart.findByIdAndUpdate(
      cartId,
      { products: [] },
      { new: true }
    );
    if (!cart) throw new Error('Carrito no encontrado');
    return cart;
  }

  async purchaseCart(cartId, userEmail) {
    const cart = await Cart.findById(cartId)
      .populate({
        path: 'products.product',
        model: 'Product',
        select: 'title price stock'
      })
      .lean();

    if (!cart.products || cart.products.length === 0) {
      throw new Error('No hay productos en el carrito para comprar');
    }
    
    const productsToPurchase = [];
    const productsNotPurchased = [];
    let totalAmount = 0;
  
    for (const item of cart.products) {
      const product = await Product.findById(item.product._id);
      if (!product) {
        productsNotPurchased.push(item.product._id);
        continue;
      }

      if (product.stock >= item.quantity) {
        product.stock -= item.quantity;
        await product.save();
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

    const ticket = new Ticket({
      code: `TKT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      purchase_datetime: new Date(),
      amount: totalAmount,
      purchaser: userEmail,
      products: productsToPurchase
    });
    await ticket.save();

    await Cart.findByIdAndUpdate(
      cartId,
      { 
        products: cart.products.filter(item => 
          productsNotPurchased.includes(item.product._id.toString())
        )
      }
    );

    return { ticket, productsNotPurchased };
  }
}

module.exports = CartDAO;