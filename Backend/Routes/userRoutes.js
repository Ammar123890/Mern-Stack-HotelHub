const userRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const {login,signup} = require('../Controllers/userController')

userRouter.post('/signup',signup)
userRouter.post('/login',login)



module.exports = userRouter;