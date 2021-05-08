const {validationResult} = require('express-validator/check');

module.exports = req => {
    const validationErrors = validationResult(req);
    if(!validationErrors.isEmpty()){
        const error = new Error('validation-failed');
        error.statusCode = 422;
        error.validation = validationErrors.array();
        throw error;
    }
}