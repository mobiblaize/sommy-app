const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    location: {
        type: String,
        required: true
    },
    pastry: {
        type: String,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    orderDate: {
        type: Date,
        required: true
    },
    deliveryDate: {
        type: Date,
        required: true
    },
    delivered: {
        type: Boolean,
        required: true
    },
});


const Order = module.exports = mongoose.model('Order', orderSchema);

module.exports.getOrderById = (id, callback) => {
    Order.findById(id, callback);
}

module.exports.getOrdersByName = async (name, callback) => {
    const query = {name};
    await Order.find(query, callback);
}

module.exports.getAllOrders = async (callback) => {
    try {
        await Order.find({}, callback);
      } catch (err) {
        throw err;
      }
}

module.exports.getOrdersBySearch = async (term, callback) => {
    try {
        await Order.find({$or: [
            { name: { $regex: term, $options: "i" } },
            { email: { $regex: term, $options: "i" } },
            { location: { $regex: term, $options: "i" } },
            { description: { $regex: term, $options: "i" } }
        ] }, callback);
      } catch (err) {
        throw err;
      }
}

module.exports.addOrder = async (newOrder, callback) => {
    try { await newOrder.save(callback) } 
    catch (err) {
        throw err;
    }
}