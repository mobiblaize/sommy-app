const mongoose = require('mongoose');

//Message schema
const messageSchema = mongoose.Schema({
    name: {
        type: String
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

module.exports.getMessagesByName = (name, callback) => {
    const query = {name};
    Message.find(query, callback);
}

module.exports.getMessagesBySearch = async (term, callback) => {
    try {
        await Message.find({$or: [
            { name: { $regex: term, $options: "i" } },
            { email: { $regex: term, $options: "i" } },
            { message: { $regex: term, $options: "i" } }
        ] }, callback);
      } catch (err) {
        console.log('Error occured');
      }
}
    

module.exports.getAllMessages = async (callback) => {
    try {
        await Message.find({}, callback);
      } catch (err) {
        throw err;
      }
}

module.exports.addMessage = async (newMessage, callback) => {
    try {
        await newMessage.save(callback);
        } 
    catch (err) {
        throw err;
    }
}