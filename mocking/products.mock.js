const { faker } = require('@faker-js/faker');

const generateMockProducts = (quantity) => {
  const products = [];
  
  for (let i = 0; i < quantity; i++) {
    products.push({
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: faker.commerce.price(),
      code: faker.string.alphanumeric(8),
      stock: faker.number.int({ min: 0, max: 100 }),
      category: faker.commerce.department(),
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
  return products;
};

module.exports = { generateMockProducts };