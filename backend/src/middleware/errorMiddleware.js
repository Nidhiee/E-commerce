// Catches requests to routes that don't exist
const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Catches any error passed via next(error) or thrown in an async route
// Must be registered LAST, after all other app.use()/routes in server.js
const errorHandler = (err, req, res, next) => {
  // If a route set status 200 but threw, default to 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

module.exports = { notFound, errorHandler };
