const path = require('path');
const fs = require('fs');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Order = require('../models/Order');
const Message = require('../models/Message');
const Post = require('../models/Post');
const multer = require('multer');
const passport = require('passport');

router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({ name: req.user.name})
} );

router.post('/register', passport.authenticate('jwt', { session: false }), (req, res) => {
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
            return res.json({success: false, msg: 'Account not found'});
        }
        Admin.comparePassword(password, user.password, (err, isMatch) => {
            if (err) res.json({success: false, msg: 'An error occured'})
            if (isMatch) {
                const token = jwt.sign(user.toJSON(), process.env.SESSION_SECRET, {
                    expiresIn: 86400
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
                    msg: 'Invalid password'
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

router.post('/orders/search', passport.authenticate('jwt', { session: false }), (req, res) => {
    let term = req.body.query;
    Order.getOrdersBySearch(term, (err, orders) => {
        if (err) {
            throw err;
        } else {
            return res.json({ orders });
        }
    })
})

router.post('/orders/delivered', passport.authenticate('jwt', { session: false }), (req, res) => {
    Order.updateDelivery(req.body.id, req.body.delivered, (err, order) => {
        if (err) {
            res.json({err: "Order not found"})
        } else {
            return res.json({order});
        }
    })
})

//Get Message list
router.get('/messages', passport.authenticate('jwt', { session: false }), (req, res) => 
    Message.getAllMessages((err, messages) => {
        if (err) {
            return res.json({ err });
        } else {
            return res.json({ messages });
        }
    })
)

router.post('/messages/search', passport.authenticate('jwt', { session: false }), (req, res) => {
    let term = req.body.query;
    Message.getMessagesBySearch(term, (err, messages) => {
        if (err) {
            return res.json({ err });
        } else {
            return res.json({ messages });
        }
    })
});

router.post('/post', passport.authenticate('jwt', { session: false }), (req, res) => {
    let id = req.body.id
    if (id.length !== 24) {
        return res.status(404).json({ message: 'Post not found' });
    }
    Post.getPost(req.body.id, (err, post) => {
        if (err) {
            return res.status(404).json({ message: 'An error occurred' });
        }
        if ( !post ) {
            return res.status(404).json({ message: 'Post not found' })
        } else {
            return res.json({ success: true, post });
        }
    });
});

function checkFileType (file, cb) {
    // Allowed extensions
    const filetypes = /jpeg|jpg|png|jiff/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype)

    if (mimetype && extname) {
        return cb(null, true)
    } else {
        cb({ message: 'Images only'})
    }
}

const storage = multer.diskStorage({
    destination : `./public/assets/posts/`,
    filename:function(req,file,cb){
        cb(null, Date.now()+'.'+file.originalname);
    }
});

const upload = multer({ 
    storage,
    limits: {fileSize: 10000000},
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
 }).array('files');

router.post('/post/add', passport.authenticate('jwt', { session: false }), (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(501).json({ error: err });
        }
        let { title, body } = req.body;

        let filenames = [];
        for ( let file of req.files) {
            filenames.push(file.filename)
        }
        let newPost = new Post ({
            title,
            images: filenames,
            body,
            date: Date.now()
        });
        Post.addPost(newPost, (err) => {
            if(err) {
                return res.status(501).json({error: { message: 'Failed to add post'}});
            } else {
                return res.json({success: true, message: 'Post added successfully' });
            }
        });
    })
});

router.post('/post/edit', passport.authenticate('jwt', { session: false }), (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(501).json({ error: err });
        }
        let id = req.body.id
        if (id.length !== 24) {
            return res.status(404).json({ message: 'Invalid post' });
        }
        Post.getPost(req.body.id, (err, post) => {
            if (err) {
                return res.status(404).json({ message: 'An error occurred' });
            }
            if ( !post ) {
                return res.status(404).json({ message: 'Post not found' })
            } else {
                let images = post.images;
                filenames = []
                if (req.body.images && req.body.images.constructor === Array) {
                    for (let img of req.body.images) {
                        images = images.filter(i => i !== img );
                        filenames.push(img);
                    }
                } else {
                    images = images.filter(i => i !== req.body.images )
                    if (req.body.images) filenames.push(req.body.images);
                }
                for ( let file of req.files) {
                    filenames.push(file.filename)
                }

                for (let image of images) {
                    fs.unlink('./public/assets/posts/'+image, (err) => {
                        if (err) {
                            if (err.code !== 'ENOENT') {
                                return res.status(501).json({ error: { message: 'An error occured images not deleted'}});
                            }
                        }
                    })
                }

                Post.updatePost(req.body.id, req.body.title, req.body.body, filenames, (err, post) => {
                    if (err) {
                        return res.status(404).json({ success: false, message: 'Post not found' })
                    } else {
                        return res.json({ success: true, message: 'Post updated successfully'});
                    }
                })
            }
        });
    });
});

router.post('/post/delete', passport.authenticate('jwt', { session: false }), (req, res) => {
    let images = req.body.images
    for (let image of images) {
        fs.unlink('./public/assets/posts/'+image, (err) => {
            if (err) {
                if (err.code !== 'ENOENT') {
                    return res.status(501).json({ message: 'An error occured images not deleted'});
                }
            }
        })
    }
    Post.deletePost(req.body._id, (err) => {
        if (err) return res.status(501).json({ message: 'An error occured post not deleted'});
        return res.json({ success: true, message: 'Post deleted successfully'});
    });
})

module.exports = router;