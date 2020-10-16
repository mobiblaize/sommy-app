const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    master: {
        type: Boolean,
        required: true
    }
});

const Admin = module.exports = mongoose.model('Admin', adminSchema);

module.exports.getAdminById = (id, callback) => {
    Admin.findById(id, callback);
}

module.exports.getAdminByEmail = (email, callback) => {
    Admin.findOne({email}, callback);
}

module.exports.getAllAdmins = (callback) => {
    try {
        Admin.find({}, callback);
      } catch (err) {
        callback(err);
      }
}

module.exports.addAdmin = async (newAdmin, callback) => {
    try {
        let hashedPassword = await bcrypt.hash(newAdmin.password, 10)
        newAdmin.password = hashedPassword;
        newAdmin.save(callback);
        } 
    catch (err) {
        callback(err);
    }
}

module.exports.comparePassword = async (candidatePassword, hash, callback) => {
    await bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        callback(err, isMatch);
    });
}