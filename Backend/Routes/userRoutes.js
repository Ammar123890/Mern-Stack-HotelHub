const userRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const {login,signup, getUsers} = require('../Controllers/userController')

userRouter.post('/signup',signup)
userRouter.post('/login',login)
userRouter.get('/',getUsers)


module.exports = userRouter;