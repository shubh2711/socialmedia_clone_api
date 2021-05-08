const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    image: { type: String, required : true },
    description: { type: String, required : true },
    user: { type: Schema.Types.ObjectId, ref: "user"},//for having a connection with the user model for knowing which user posted the image
    createdAt: { type: String, default: Date.now() }
});

module.exports = mongoose.model('post', postSchema);