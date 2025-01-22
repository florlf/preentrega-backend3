const fs = require("fs/promises");

class CartManager {
  constructor(path) {
    this.path = path;
  }


  async createCart() {
    const data = await this._readFile();
    const newCart = { 
      id: this._generateId(data),
      products: []
    };
    data.push(newCart);
    await this._writeFile(data);
    return newCart;
  }


  async getCartById(id) {
    const data = await this._readFile();
    const idNumber = Number(id);
    return data.find((cart) => cart.id === idNumber);
  }


  async addProductToCart(cartId, productId) {
    const data = await this._readFile();
    const idNumber = Number(cartId);
    const cart = data.find((cart) => cart.id === idNumber);
  
    if (!cart) throw new Error("Carrito no encontrado");
  
    const productIdNumber = Number(productId);
    const productIndex = cart.products.findIndex(
      (product) => product.product === productIdNumber
    );
  
    if (productIndex === -1) {
      cart.products.push({ product: productIdNumber, quantity: 1 });
    } else {
      cart.products[productIndex].quantity += 1;
    }
  
    await this._writeFile(data);
    return cart;
  }

  async deleteCart(id) {
    const data = await this._readFile();
    
    const index = data.findIndex((cart) => cart.id === Number(id));
    if (index === -1) {
      return null;
    }
    
    data.splice(index, 1);
    
    await this._writeFile(data);
    
    return true;
  }
  

  async _readFile() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch {
      return [];
    }
  }


  async _writeFile(data) {
    await fs.writeFile(this.path, JSON.stringify(data, null, 2));
  }


  _generateId(data) {
    return data.length ? Math.max(...data.map((cart) => cart.id)) + 1 : 1;
  }
}

module.exports = CartManager;