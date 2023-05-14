const adminRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const {login,addHotel,deleteHotel, updateHotel} = require('../Controllers/adminController')
const {verifyAdmin, verifyToken} = require('../Middlewares/userMiddleware')


adminRouter.post('/login',login)
adminRouter.post('/addHotel', verifyToken, verifyAdmin, addHotel)
adminRouter.delete('/deleteHotel/:id', verifyToken, verifyAdmin, deleteHotel)
adminRouter.post('./updateHotel/:id', verifyToken, verifyAdmin, updateHotel)



module.exports = adminRouter;