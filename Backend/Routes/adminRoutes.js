const adminRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const {login,signup} = require('../Controllers/adminController')

adminRouter.post('/signup',signup)
adminRouter.post('/login',login)



module.exports = adminRouter;