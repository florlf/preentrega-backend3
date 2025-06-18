const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');

const app = require('../app');

describe('Auth Routes', () => {
  
  describe('POST /register', () => {
    it('debería registrar un nuevo usuario', async () => {
      const res = await request(app)
        .post('/api/sessions/register')
        .send({
          first_name: 'Test',
          last_name: 'User',
          email: 'testuser@example.com',
          password: 'test1234'
        });

      expect(res.status).to.be.oneOf([200, 201]);
      expect(res.body).to.have.property('message');
    });
  });

  describe('POST /login', () => {
    it('debería iniciar sesión con un usuario válido', async () => {
      const res = await request(app)
        .post('/api/sessions/login')
        .send({
          email: 'testuser@example.com',
          password: 'test1234'
        });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('token');
    });
  });

  describe('GET /current', () => {
    let token;

    before(async () => {
      const res = await request(app)
        .post('/api/sessions/login')
        .send({
          email: 'testuser@example.com',
          password: 'test1234'
        });
      token = res.body.token;
    });

    it('debería devolver los datos del usuario actual', async () => {
      const res = await request(app)
        .get('/api/sessions/current')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('email');
    });
  });

  describe('POST /logout', () => {
    it('debería cerrar sesión del usuario', async () => {
      const res = await request(app)
        .post('/api/sessions/logout');

      expect(res.status).to.equal(200);
    });
  });
});