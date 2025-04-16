const Ticket = require('../models/Ticket');

class TicketDAO {
  async create(ticketData) {
    const ticket = new Ticket(ticketData);
    return await ticket.save();
  }

  async getByCode(code) {
    return await Ticket.findOne({ code }).lean();
  }

  async getByPurchaser(email) {
    return await Ticket.find({ purchaser: email }).lean();
  }
}

module.exports = TicketDAO;