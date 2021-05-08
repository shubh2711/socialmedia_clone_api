const jwt = require('jwt-simple');
const config = require('../config');
const redisClient = require("../config/redis").getClient();
const validationHandler = require("../validations/validationHandler")
const { isEmail, hasPassword, hasName} = require('../validations/validators')
const User = require('../modals/user');

exports.login =async (req, res, next ) => {
    try{
         const email = req.body.email;
         const password = req.body.password;

         const user = await User.findOne({ email }).select("+password");
         if(!user){
             const error = new Error("wrong credentials");
             error.statusCode = 401;
             throw error;
         }

         const validPassword = await user.validPassword(password);
         if(!validPassword){
            const error = new Error("wrong credentials password");
            error.statusCode = 401;
            throw error;
         }

         const token = jwt.encode({id : user.id }, config.jwtSecret);
         return res.send({user, token});
    } catch(err){
        next(err);
    }
}


exports.signup =async (req, res, next ) => {
    try{
        validationHandler(req); 

         const existingUser = await User.findOne({ email: req.body.email });
         if(existingUser){
             const error = new Error("Email already exists");
             error.statusCode = 401;
             throw error;
         }

         let user = new User();
         user.email = req.body.email;
         user.password = await user.encryptPassword(req.body.password);
         user.name= req.body.name;
         user = await user.save();

         const token = jwt.encode({ id: user.id}, config.jwtSecret);
         return res.send({user, token });
    } catch(err){
        next(err);
    }
}

exports.me =async (req, res, next ) => {
    try{
        const cacheValue = await redisClient.hget("users", req.user.id);//check with redis that if inside the hash key of users we have an id
        if(cacheValue) { // we will check if we have a chacheValue.
            console.log("getting from redis");
            const doc = JSON.parse(cacheValue);
            const cacheUser = new User(doc);
            return res.send(cacheUser);
        }
        console.log("getting from db");
        const user = await User.findById(req.user);// before returning the users to the client we will also store the values in redis
        redisClient.hset("users", req.user.id, JSON.stringify(user));
        return res.send(user);

    } catch(err){
        next(err);
    }
}