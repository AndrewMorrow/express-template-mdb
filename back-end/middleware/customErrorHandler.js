const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler = (err, req, res, next) => {
    // const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(err.statusCode);
    res.json({
        message: err.message,
        errors: err.errors,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
};

const catchError = (fn) => {
    return function (req, res, next) {
        return fn(req, res, next).catch((e) => {
            next(e);
        });
    };
};

export { notFound, errorHandler, catchError };
