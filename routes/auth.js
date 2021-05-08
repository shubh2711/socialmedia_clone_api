const express = require('express');
const router = express.Router();
const {isEmail, hasPassword, hasName} = require('../validations/validators')
const authController = require("../controllers/authController");
const passportJWT = require('../middlewares/passportJWT')();

router.post("/login", authController.login);
router.post("/signup",[isEmail, hasPassword, hasName], authController.signup);
router.get("/me",passportJWT.authenticate(),authController.me);

module.exports = router;