if (process.env.NODE_ENV !== 'production') {
    const path = require('path');
    require('dotenv').config({path:__dirname+'/../.env'})
  }
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Order = require('../models/Order');
const Message = require('../models/Message');
const passport = require('passport');

router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({ name: req.user.name})
} );

router.post('/register', (req, res) => {
    let newAdmin = new Admin({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        master: false
    });
    Admin.addAdmin(newAdmin, (err) => {
        if(err) {
            res.json({success: false, msg: 'Failed to register user'});
        } else {
            res.json({success: true, msg: 'User registered'});
        }
    })
})


router.post('/login', (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    Admin.getAdminByEmail(email, (err, user) => {
        if (err) throw err;
        if (!user) {
            return res.json({success: false, msg: 'Admin account not found'});
        }
        Admin.comparePassword(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign(user.toJSON(), process.env.SESSION_SECRET, {
                    expiresIn: 600
                });
                res.json({
                    success: true,
                    token: 'JWT ' + token,
                    user: {
                        id: user._id,
                        email: user.email
                    }
                })
            } else {
                res.json({
                    success: false,
                    msg: 'Wrong password'
                });
            }
        })
    })
});

//Get order list
router.get('/orders', passport.authenticate('jwt', { session: false }), (req, res) => 
    Order.getAllOrders((err, orders) => {
        if (err) {
            throw err;
        } else {
            return res.json({ orders });
        }
    })
)

router.post('/orders/search', (req, res) => {
    let term = req.body.query;
    Order.getOrdersBySearch(term, (err, orders) => {
        if (err) {
            throw err;
        } else {
            return res.json({ orders });
        }
    })
})

//Get Message list
router.get('/messages', passport.authenticate('jwt', { session: false }), (req, res) => 
    Message.getAllMessages((err, messages) => {
        if (err) {
            throw err;
        } else {
            return res.json({ messages });
        }
    })
)

router.post('/messages/search', (req, res) => {
    let term = req.body.query;
    Message.getMessagesBySearch(term, (err, messages) => {
        if (err) {
            throw err;
        } else {
            return res.json({ messages });
        }
    })
})

module.exports = router;