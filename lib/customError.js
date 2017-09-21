function isApiCall(req) {
    return req.originalUrl.indexOf('/api') === 0;
}

function customError(err, req, res, next) {
    if (isApiCall(req)) {
        res.json({
            status: err.status || 500,
            message: err.message,
            errorCode: err.errorCode,
            innerError: err.innerError
        });
    } else {
        next(err);
    }
}

module.exports = customError;