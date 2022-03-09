/**
 * Middleware untuk memverifikasi JWT Token / Session
 */
 const passport = require('../lib/passport')
 module.exports = passport.authenticate('jwt', {
     session: false
 })