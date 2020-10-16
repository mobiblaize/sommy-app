const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    images: {
        type: Array,
        default: []
    },
    body: {
        type: String
    },
    date: {
        type: String,
        required: true
    }
});

const Post = module.exports = mongoose.model('Post', postSchema);

module.exports.getPostById = (id, callback) => {
    Post.findById(id, callback);
}

module.exports.updatePost = async (id, title, body, images, callback) => {
    try {
        let res = await Post.findOneAndUpdate({_id: id}, { title, body, images }, {
            new: true,
            upsert: true,
            rawResult: true,
            useFindAndModify: false
          });
        callback(null, res.value)
    } catch (err) {
        callback(err);
    }
}

module.exports.getPostsBytitle = async (title, callback) => {
    await Post.find({title}, callback);
}

module.exports.getAllPosts = async (callback) => {
    try {
        await Post.find({}, callback);
      } catch (err) {
        callback(err)
      }
}

module.exports.getPostsBySearch = async (term, callback) => {
    try {
        await Post.find({$or: [
            { title: { $regex: term, $options: "i" } },
            { folder: { $regex: term, $options: "i" } },
            { body: { $regex: term, $options: "i" } }
        ] }, callback);
      } catch (err) {
        callback(err);
      }
}

module.exports.getPost = async (id, callback) => {
    try { await Post.findOne({_id : id}, callback); }
    catch (err) {
        callback(err);
    }
}

module.exports.addPost = async (newPost, callback) => {
    try { await newPost.save(callback) }
    catch (err) {
        callback(err);
    }
}

module.exports.deletePost = async (id, callback) => {
    try { await Post.deleteOne({_id: id}, callback)} 
    catch (err) {
        callback(err);
    }
}