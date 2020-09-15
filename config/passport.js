if (process.env.NODE_ENV !== 'production') {
    const path = require('path');
    require('dotenv').config({path:__dirname+'/../.env'})
  }
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const Admin = require('../models/Admin');

module.exports = function (passport) {
    let opts = {}
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    opts.secretOrKey = process.env.SESSION_SECRET;
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        Admin.getAdminById(jwt_payload._id, (err, Admin) => {
            if (err) {
                return done(err, false);
            }
            if (Admin) {
                return done(null, Admin);
            } else {
                return done(null, false);
                
            }
        })
    }))
}