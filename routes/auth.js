'use strict'

const auth = require('basic-auth');

const admins = {
  'admin': {password: 'meowmix'}
};

module.exports = function(req, res, next) {

  var user = auth(req);
  if (!user || !admins[user.name] || admins[user.name].password !== user.pass) {
    return res.status(401,  'WWW-Authenticate').send('Unauthorized');
  }
  return next();
};
