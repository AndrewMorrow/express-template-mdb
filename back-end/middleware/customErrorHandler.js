// 404 not found trigger
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// create a custom error
const createError = (errTitle, errMsg, statusCode) => {
  const err = new Error(errTitle);
  err.errors = { error: errMsg };
  err.statusCode = statusCode;
  return err;
};

// custom error handler
const errorHandler = (err, req, res, next) => {
  const statusCode =
    err.statusCode === undefined || err.statusCode === 200
      ? 500
      : err.statusCode;

  res.status(statusCode).json({
    message: err.message,
    errors: err.errors,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

// catch async errors
const catchError = (fn) => {
  return function (req, res, next) {
    return fn(req, res, next).catch((e) => {
      next(e);
    });
  };
};

export { notFound, errorHandler, catchError, createError };
