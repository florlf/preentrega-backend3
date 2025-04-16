const ProductRepository = require('../repositories/ProductRepository');

class ProductService {
  constructor() {
    this.productRepository = new ProductRepository();
  }

  async getProducts(options) {
    const result = await this.productRepository.getProducts(options);
    
    const buildLink = (targetPage) => {
      const params = new URLSearchParams();
      params.set('limit', options.limit);
      params.set('page', targetPage);
      if (options.query) params.set('query', options.query);
      if (options.sort) params.set('sort', options.sort);
      return `/products?${params.toString()}`;
    };

    return {
      status: 'success',
      payload: result.docs,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? buildLink(result.prevPage) : null,
      nextLink: result.hasNextPage ? buildLink(result.nextPage) : null,
    };
  }

  async getProductById(id) {
    return this.productRepository.getProductById(id);
  }

  async addProduct(productData) {
    return this.productRepository.addProduct(productData);
  }

  async updateProduct(id, updatedData) {
    return this.productRepository.updateProduct(id, updatedData);
  }

  async deleteProduct(id) {
    return this.productRepository.deleteProduct(id);
  }

  async updateProductStock(productId, newStock) {
    return this.productRepository.updateProductStock(productId, newStock);
  }
}

module.exports = ProductService;