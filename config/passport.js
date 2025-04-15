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


passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    const user = await User.findById(jwt_payload.id);
    if (!user) return done(null, false);
    return done(null, user);
  } catch (err) {
    console.error('Error en autenticación JWT:', err);
    return done(err, false);
  }
}));

module.exports = passport;