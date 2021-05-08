const {body} = require('express-validator/check');

exports.hasDescription = body('description')
.isLength({min: 5})
.withMessage('Description is required. Min length is 5 characters');
// exports.hasName = body('name')
// .isLength({min: 5})
// .withMessage('Nma eis required. Min length is 5 characters');

exports.isEmail = body('email')
.isEmail()
.withMessage('Email field must consist of a valid email');

exports.hasPassword = body('password')
.exists()
.withMessage('Password cannot be empty');

exports.hasName = body("name")
.isLength({min: 5})
.withMessage("Name is required. Min length 5 characters");