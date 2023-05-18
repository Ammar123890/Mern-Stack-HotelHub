const adminRouter_auth = require('express').Router();
const {    login  } = require('../../Controllers/adminController/authController')


adminRouter_auth.post('/login', login)
module.exports = adminRouter_auth;