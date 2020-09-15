const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Message = require('../models/Message');

router.post('/order', (req, res) => {
    let { name, phone, email, location, pastries, description, deliveryDate } = req.body;
    let pastry = pastries.pastry;
    size = pastries.size;
    let errors =[];

    if (!name) {
        errors.push( {text: 'please add a name' });
    }
    if (!phone) {
        errors.push( {text: 'please add your phone number' });
    }
    if (!location) {
        errors.push( {text: 'please add a location' });
    }
    if (!pastry) {
        errors.push( {text: 'please select a pastry' });
    }
    if (!size) {
        errors.push( {text: 'please select a size' });
    }
    if (!deliveryDate) {
        errors.push( {text: 'please add a delivery date' });
    }

    //Check for errors
    if (errors.length > 0) {
        res.json({ success: false, errors })
    } else {
        if (!email) email = 'None';
        if (!description) description = 'None';
        //Insert into db
        const newOrder = new Order ({
            name, 
            phone, 
            email, 
            location, 
            pastry, 
            size, 
            description,
            orderDate: Date.now(), 
            deliveryDate, 
            delivered: false
        })
        Order.addOrder(newOrder, (err) => {
            if(err) {
                res.json({success: false, msg: 'Failed to Place your order'});
            } else {
                res.json({success: true, msg: 'Your order has been placed successfully'});
            }
        })
        }
})

router.post('/message', (req, res) => {
    let { name, email, findUs, news, message } = req.body;
    let errors =[];

    if (!name) {
        errors.push( {text: 'please add a name' });
    }
    if (!email) {
        errors.push( {text: 'please add your email' });
    }
    if (!findUs) {
        errors.push( {text: 'please select a source' });
    }
    if (!message) {
        errors.push( {text: "you haven't entered your message" });
    }

    //Check for errors
    if (errors.length > 0) {
        res.json({ 
            success: false, errors
        })
    } else {
        if (!news) news = false;
        //Insert into table
        let newMessage = new Message({
            name, 
            email, 
            findUs, 
            news, 
            message, 
            date: Date.now()});

        Message.addMessage(newMessage, (err) => {
            if(err) {
                res.json({success: false, msg: 'Failed to register user'});
            } else {
                res.json({success: true, msg: 'User registered'});
            }
        })
        }
});

module.exports = router;