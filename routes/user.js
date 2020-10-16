const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Message = require('../models/Message');
const Post = require('../models/Post');
const moment = require('moment');

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
    if (moment().isAfter(deliveryDate)) {
        errors.push( {text: 'Delivery date must be at least 1 day after placing your order' });
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
        errors.push( {text: 'Tell us how you found us' });
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
                res.json({success: false, msg: 'Failed to send your feedback'});
            } else {
                res.json({success: true, msg: 'Thanks for your feedback'});
            }
        })
        }
});

router.get('/posts', (req, res) => 
    Post.getAllPosts((err, posts) => {
        if (err) {
            throw err;
        } else {
            return res.json({ posts });
        }
    })
)

module.exports = router;