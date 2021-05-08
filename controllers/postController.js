const Post = require('../modals/post')
const validationHandler = require("../validations/validationHandler")

exports.index = async (req,res) => {
    // throw new Error("some random error");
    // res.send({message: "hi"});
    try{
        const pagination = req.query.pagination
          ? parseInt(req.query.pagination)
          : 10;

        const page = req.query.page ? parseInt(req.query.page) : 1; 
        console.log(req.user.following);
        const posts = await Post.find({
            user: { $in: [...req.user.following, req.user.id] }
        }).skip((page - 1) * pagination)
        .limit(pagination)
        .populate("user").sort({ createdAt: -1 }); 
        res.send(posts);
    }catch(err){
        next(err);
    }
}

exports.show = async (req,res) => {
    try{
        const posts = await Post.findOne({
            _id: req.params.id,
            user: { $in: [...req.user.following, req.user.id]}
        }).populate("user")
        res.send(posts);
    }catch(err){
        next(err);
    }
}

exports.update = async (req,res,next) => {
    try{
        validationHandler(req);
        console
        let post = await Post.findById(req.params.id);
        // check if auth user is author
        if (!post || post.user != req.user.id){
            const error = new Error("wrong request");
            error.statusCode = 400;
            throw error;
        }
        post.description = req.body.description;
        post = await post.save();
        res.send(post);
    }catch(err){
        next(err);
    }
}

exports.delete = async (req,res,next) => {
    try{
        validationHandler(req);
        console
        let post = await Post.findById(req.params.id);
        if (!post || post.user != req.user.id){
            const error = new Error("wrong request");
            error.statusCode = 400;
            throw error;
        }
        await post.delete();
        res.send({ message: "Succefully Deleted"});
    }catch(err){
        next(err);
    }
}

exports.store = async (req, res, next) => {
    try{
        validationHandler(req);
        // res.send({message: "the name is "+ req.body.name });
        let post = new Post();
        post.description = req.body.description;
        post.image = req.file.filename;
        post.user = req.user;
            post = await post.save();
        res.send(post);
    } catch(err){
        next(err);
    }

};