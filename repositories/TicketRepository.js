const TicketDAO = require('../dao/TicketDAO');

class TicketRepository {
  constructor() {
    this.dao = new TicketDAO();
  }

  async createTicket(ticketData) {
    return this.dao.create(ticketData);
  }

  async getTicketByCode(code) {
    return this.dao.getByCode(code);
  }

  async getTicketsByUser(email) {
    return this.dao.getByPurchaser(email);
  }
}

module.exports = TicketRepository;