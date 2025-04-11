const passport = require('passport');

const passportCall = (strategy) => {
  return (req, res, next) => {
    passport.authenticate(strategy, { session: false }, (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ 
          status: 'error',
          message: info.message || 'No autorizado'
        });
      }
      req.user = user;
      next();
    })(req, res, next);
  };
};

const authorization = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'No tienes permisos para realizar esta acción'
      });
    }
    next();
  };
};

module.exports = {
  passportCall,
  authorization
};