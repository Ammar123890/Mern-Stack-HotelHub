const userRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const { login, signup, getUsers, getUserByID, addComment } = require('../Controllers/userController')

userRouter.post('/signup', signup)
userRouter.post('/login', login)
userRouter.get('/', getUsers)
userRouter.get('/:id', getUserByID)
userRouter.post('/:user_id/:hotel_id', addComment)


module.exports = userRouter;