/**
 * Global error handling middleware.
 * Must be registered last in Express middleware chain.
 */
const errorMiddleware = (err, req, res, _next) => {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal server error';

  return res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = { errorMiddleware };
