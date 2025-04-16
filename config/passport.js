const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const UserDAO = require('../dao/UserDAO');
const userDAO = new UserDAO();

const opts = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    (req) => req?.cookies?.jwt || null
  ]),
  secretOrKey: process.env.JWT_SECRET
};

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    const user = await userDAO.findById(jwt_payload.id);
    user ? done(null, user) : done(null, false);
  } catch (err) {
    console.error('Error en JWT:', err);
    done(err, false);
  }
}));

module.exports = passport;