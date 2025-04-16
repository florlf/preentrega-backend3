const Product = require('../models/Product');

class ProductDAO {
  async getProducts({ limit = 10, page = 1, sort, query }) {
    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {},
      lean: true
    };

    const filter = query ? { category: query } : {};
    return await Product.paginate(filter, options);
  }

  async getProductById(id) {
    return await Product.findById(id).lean();
  }

  async addProduct(productData) {
    const product = new Product({
      title: productData.title,
      description: productData.description,
      code: productData.code,
      price: productData.price,
      stock: productData.stock,
      category: productData.category,
      thumbnail: productData.thumbnail || ''
    });
    return await product.save();
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

module.exports = ProductDAO;