const mongoose = require('mongoose');

//Message schema
const messageSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    findUs: {
        type: String,
        required: true
    },
    news: {
        type: Boolean,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
})

const Message = module.exports = mongoose.model('Message', messageSchema);

module.exports.getMessageById = (id, callback) => {
    Message.findById(id, callback);
}

module.exports.getMessagesByName = async (name, callback) => {
    await Message.find({name}, callback);
}

module.exports.getMessagesBySearch = async (term, callback) => {
    await Message.find({$or: [
        { name: { $regex: term, $options: "i" } },
        { email: { $regex: term, $options: "i" } },
        { message: { $regex: term, $options: "i" } }
    ] }, callback);
}
    

module.exports.getAllMessages = async (callback) => {
    await Message.find({}, callback);
}

module.exports.addMessage = async (newMessage, callback) => {
    await newMessage.save(callback);
}