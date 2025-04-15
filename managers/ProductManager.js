const Product = require('../models/Product');

class ProductManager {
  async getProducts({ limit = 10, page = 1, sort, query }) {
    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {},
      lean: true,
    };

    const filter = query && query !== 'undefined' && query !== '' ? { category: query } : {};

    const result = await Product.paginate(filter, options);

    const buildLink = (targetPage) => {
      const params = new URLSearchParams();
      params.set('limit', limit);
      params.set('page', targetPage);
      if (query && query !== 'undefined') params.set('query', query);
      if (sort) params.set('sort', sort);
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
    return await Product.findById(id).lean();
  }

  async addProduct(product) {
    const newProduct = new Product({
      title: product.title,
      description: product.description,
      code: product.code,
      price: product.price,
      stock: product.stock,
      category: product.category,
      thumbnail: product.thumbnail || '',
    });
    return await newProduct.save();
  }

  async updateProduct(id, updatedData) {
    return await Product.findByIdAndUpdate(id, updatedData, { new: true }).lean();
  }

  async deleteProduct(id) {
    return await Product.findByIdAndDelete(id);
  }

  async updateProductStock(productId, newStock) {
    if (newStock < 0) throw new Error("El stock no puede ser negativo");
    
    const product = await Product.findByIdAndUpdate(
        productId,
        { stock: newStock },
        { new: true }
    ).lean();

    if (!product) throw new Error("Producto no encontrado");
    return product;
  }
}

module.exports = ProductManager;