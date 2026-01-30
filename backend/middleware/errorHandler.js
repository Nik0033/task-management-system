const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    console.error('ERROR 💥:', err);

    res.status(err.statusCode).json({
        success: false,
        status: err.status,
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        error: err // Optional: Include full error object for debugging if needed
    });
};

module.exports = errorHandler;
