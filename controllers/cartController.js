import CartManager from '../managers/CartManager.js';
import MailingService from '../services/mailing.service.js';

export default class CartController {
  constructor() {
    this.cartManager = new CartManager();
    this.mailingService = new MailingService();
  }

  purchaseCart = async (req, res) => {
    try {
      const cartId = req.params.cid;
      const userEmail = req.user.email;

      const result = await this.cartManager.purchaseCart(cartId, userEmail);

      return res.status(200).json({
        status: 'success',
        ticket: result.ticket,
        productsNotPurchased: result.productsNotPurchased
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: 'error', message: error.message });
    }
  };
}