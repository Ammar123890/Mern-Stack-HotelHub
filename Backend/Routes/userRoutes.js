const userRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const {login,signup, getUsers, getUserByID} = require('../Controllers/userController')

userRouter.post('/signup',signup)
userRouter.post('/login',login)
userRouter.get('/',getUsers)
userRouter.get('/:id',getUserByID)

module.exports = userRouter;