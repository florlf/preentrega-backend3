const mongoose = require('mongoose');
const Cart = require('./Cart');

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart',
    required: false
  },
  role: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' 
  }
});

userSchema.pre('save', async function(next) {
  if (this.isNew && this.role === 'user' && !this.cart) { 
    try {
      const newCart = await Cart.create({});
      this.cart = newCart._id;
    } catch (err) {
      return next(err);
    }
  }
  next();
});

module.exports = mongoose.model('User', userSchema);