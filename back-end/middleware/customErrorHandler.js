const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

// create a custom error
const createError = (message, errType, errMsg, statusCode) => {
    const err = new Error(message);
    err.errors = { [errType]: errMsg };
    err.statusCode = statusCode;
    return err;
};

// custom error handler
const errorHandler = (err, req, res, next) => {
    const statusCode =
        err.statusCode === undefined || err.statusCode === 200
            ? 500
            : err.statusCode;

    res.status(statusCode);
    res.json({
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
