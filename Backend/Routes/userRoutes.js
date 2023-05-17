const userRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const {login,signup,forgotPassword, resetPassword} = require('../Controllers/userController')



userRouter.post('/signup',signup)
userRouter.post('/login',login)
userRouter.post('/forgotPassword/:email', forgotPassword);
userRouter.post('/resetPassword', resetPassword);





module.exports = userRouter;