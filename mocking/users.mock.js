const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');

const generateMockUsers = (quantity) => {
  const users = [];
  const encryptedPassword = bcrypt.hashSync('coder123', 10);

  for (let i = 0; i < quantity; i++) {
    users.push({
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      age: faker.number.int({ min: 18, max: 80 }),
      password: encryptedPassword,
      role: faker.helpers.arrayElement(['user', 'admin']),
      pets: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
  return users;
};

module.exports = { generateMockUsers };