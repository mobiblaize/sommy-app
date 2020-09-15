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
    const query = {email};
    Admin.findOne(query, callback);
}

module.exports.getAllAdmins = async (callback) => {
    try {
        await Admin.find({}, callback);
      } catch (err) {
        throw err;
      }
}

module.exports.addAdmin = async (newAdmin, callback) => {
    try {
        const hashedPassword = await bcrypt.hash(newAdmin.password, 10)
        newAdmin.password = hashedPassword;
        newAdmin.save(callback);
        } 
    catch (err) {
        throw err;
    }
}

module.exports.comparePassword = async (candidatePassword, hash, callback) => {
    await bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) console.log('There was an error');
        callback(null, isMatch);
    });
}