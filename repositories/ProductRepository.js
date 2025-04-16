const ProductDAO = require('../dao/ProductDAO');

class ProductRepository {
  constructor() {
    this.dao = new ProductDAO();
  }

  async getProducts(options) {
    return this.dao.getProducts(options);
  }

  async getProductById(id) {
    return this.dao.getProductById(id);
  }

  async addProduct(productData) {
    return this.dao.addProduct(productData);
  }

  async updateProduct(id, updatedData) {
    return this.dao.updateProduct(id, updatedData);
  }

  async deleteProduct(id) {
    return this.dao.deleteProduct(id);
  }

  async updateProductStock(productId, newStock) {
    return this.dao.updateProductStock(productId, newStock);
  }
}

module.exports = ProductRepository;