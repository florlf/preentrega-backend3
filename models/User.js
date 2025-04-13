const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
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
  const user = this;

  if (user.isNew && user.role === 'user' && !user.cart) { 
    try {
      const newCart = await Cart.create({});
      user.cart = newCart._id;
    } catch (err) {
      return next(err);
    }
  }

  if (!user.isModified('password')) return next();

  try {
    if (!user.password.startsWith('$2b$')) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;
    }
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('User', userSchema);