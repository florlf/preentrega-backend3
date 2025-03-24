const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
  role: { type: String, default: 'user' }
});

userSchema.pre('save', async function(next) { // Usar async
  const user = this;

  // Si la contraseña no se modifica, no hace falta hashearla de nuevo
  if (!user.isModified('password')) return next();

  try {
    // Usamos await para que la promesa se resuelva antes de continuar
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    next();
  } catch (err) {
    next(err); // Pasar el error si ocurre
  }
});

module.exports = mongoose.model('User', userSchema);