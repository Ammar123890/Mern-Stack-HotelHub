const userRouter_auth = require('express').Router();
const {login,signup,forgotPassword, resetPassword} = require('../../Controllers/userController/authController')



userRouter_auth.post('/signup',signup)
userRouter_auth.post('/login',login)
userRouter_auth.post('/forgotPassword/:email', forgotPassword);
userRouter_auth.post('/resetPassword', resetPassword);





module.exports = userRouter_auth;