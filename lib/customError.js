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
                // localize messages here, so mongoose validation messages works
                // remember: mongoose compile models on init, so validation messages
                // can't be dynamic
                message: __(err.errors[key].message)
            };
            err.valErrors.push(errInfo);
        });
    }
    if (isApiCall(req)) {
        // for API calls return JSON
        res.json({
            status: err.status || 500,
            message: err.message,
            errors: err.valErrors
        });
    } else {
        next(err);
    }
}

module.exports = customError;