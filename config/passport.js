const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const User = require('../models/User');

const opts = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    (req) => {
      let token = null;
      if (req && req.cookies) {
        token = req.cookies['jwt'];
      }
      return token;
    }
  ]),
  secretOrKey: process.env.JWT_SECRET
};

// Agregar logging para depuración
passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    console.log('JWT Payload:', jwt_payload);
    const user = await User.findById(jwt_payload.id).populate('cart');
    if (!user) return done(null, false);
    console.log('Usuario autenticado:', user.email);
    return done(null, user);
  } catch (err) {
    console.error('Error en autenticación JWT:', err);
    return done(err, false);
  }
}));

module.exports = passport;