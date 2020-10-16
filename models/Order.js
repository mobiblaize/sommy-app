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

module.exports.updateDelivery = async (id, delivered, callback) => {
    try {
        let res = await Order.findOneAndUpdate({_id: id}, { delivered }, {
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

module.exports.getOrdersByName = async (name, callback) => {
    await Order.find({name}, callback);
}

module.exports.getAllOrders = async (callback) => {
    await Order.find({}, callback);
}

module.exports.getOrdersBySearch = async (term, callback) => {
    await Order.find({$or: [
        { name: { $regex: term, $options: "i" } },
        { email: { $regex: term, $options: "i" } },
        { location: { $regex: term, $options: "i" } },
        { description: { $regex: term, $options: "i" } }
    ] }, callback);
}

module.exports.addOrder = async (newOrder, callback) => {
    await newOrder.save(callback);
}