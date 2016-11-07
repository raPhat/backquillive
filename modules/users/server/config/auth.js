'use strict';

// auth.js
var passport = require('passport');
var passportJWT = require('passport-jwt');
var ExtractJwt = passportJWT.ExtractJwt;
var Strategy = passportJWT.Strategy;
var params = {
  secretOrKey: 'ImagineOnTheWorld',
  jwtFromRequest: ExtractJwt.fromAuthHeader()
};

var _ = require('lodash'),
  mongoose = require('mongoose'),
  User = mongoose.model('User');

module.exports = function() {
  var strategy = new Strategy(params, function(payload, done) {
    User.findOne({
      _id: payload.id
    }).exec(function (err, user) {
      if (err) {
        return done(new Error('User Error'), null);
      }

      if (user) {
        return done(null, user);
      } else {
        return done(new Error('User not found'), null);
      }
    });
  });
  passport.use(strategy);
  return {
    initialize: function() {
      return passport.initialize();
    },
    authenticate: function() {
      return passport.authenticate('jwt', { session: false });
    }
  };
};
