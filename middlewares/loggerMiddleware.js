const logger = require('../utils/logger');

const loggerMiddleware = (req, res, next) => {
  const { headers } = req;
  const safeHeaders = { ...headers };
  delete safeHeaders.cookie;
  delete safeHeaders.authorization;

  logger.http(`[${req.method}] ${req.originalUrl}`, {
    ip: req.ip,
    headers: safeHeaders,
    body: req.body ? '[BODY HIDDEN]' : null
  });

  const originalSend = res.send;
  res.send = function(body) {
    logger.http(`[${req.method}] ${req.originalUrl} - Status: ${res.statusCode}`, {
      response: (typeof body === 'string' && body.length > 200) 
        ? '[CONTENT TRUNCATED]' 
        : body
    });

    originalSend.call(this, body);
  };

  next();
};

module.exports = loggerMiddleware;