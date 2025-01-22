const fs = require("fs/promises");

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async getProducts(limit) {
    const data = await this._readFile();
    return limit ? data.slice(0, limit) : data;
  }

  async getProductById(id) {
    const data = await this._readFile();
    const idNumber = Number(id);
    return data.find((p) => p.id === idNumber);
  }    

  async addProduct(product) {
    const data = await this._readFile();
    const id = this._generateId(data);
    const newProduct = { id, ...product, status: true };
    data.push(newProduct);
    await this._writeFile(data);
    return newProduct;
  }

  async updateProduct(id, updatedData) {
    const data = await this._readFile();
    
    const idNumber = Number(id);
    
    const index = data.findIndex((p) => p.id === idNumber);
  
    if (index === -1) {
      return null;
    }
  
    data[index] = { ...data[index], ...updatedData };
  
    await this._writeFile(data);
    
    return data[index];
  }

  async deleteProduct(id) {
    const data = await this._readFile();
    const idNumber = Number(id);
    
    const filtered = data.filter((p) => p.id !== idNumber);
    await this._writeFile(filtered);
  }  

  async _readFile() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.log("Error leyendo archivo:", error);
      return [];
    }
  }

  async _writeFile(data) {
    await fs.writeFile(this.path, JSON.stringify(data, null, 2));
  }

  _generateId(data) {
    return data.length ? Math.max(...data.map((p) => p.id)) + 1 : 1;
  }  
}

module.exports = ProductManager;