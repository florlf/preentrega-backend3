const nodemailer = require('nodemailer');

class MailingService {
    constructor() {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS
        }
      });
    }  

  async sendPurchaseEmail(userEmail, ticket) {
    const mailOptions = {
        from: `"Eclipse Store" <${process.env.GMAIL_USER}>`,
        to: userEmail,
        subject: '✅ Confirmación de compra',
        html: `
            <div style="font-family: Arial; padding: 20px;">
            <h2><strong>¡Gracias por tu compra!</strong></h2>
            <p><strong>Código de ticket:</strong> ${ticket.code}</p>
            <p><strong>Total:</strong> $${ticket.amount}</p>
            <p><strong>¡Tu pedido ya está siendo preparado! Te avisaremos cuando esté en camino.</p>
            </div>
        `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('📨 Email enviado a:', userEmail);
      return { success: true };
    } catch (error) {
      console.error("Error enviando email:", error);
      return { success: false, error };
    }
  }
}

module.exports = MailingService;