function isApiCall(req) {
    return req.originalUrl.indexOf('/api') === 0;
}

function customError(err, req, res, next) {
    if (err.name === 'ValidationError') {
        err.status = 422;
        err.message = __('Data not valid');
        err.valErrors = [];
        Object.keys(err.errors).map(function(key) {
            const errInfo = {
                field: key,
                message: err.errors[key].message
            };
            err.valErrors.push(errInfo);
        });
    }
    if (isApiCall(req)) {
        res.json({
            status: err.status || 500,
            message: err.message,
            errorCode: err.errorCode,
            innerError: err.innerError,
            errors: err.valErrors
        });
    } else {
        next(err);
    }
}

module.exports = customError;