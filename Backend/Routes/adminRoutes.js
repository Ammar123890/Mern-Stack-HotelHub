const adminRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const { login, addHotel, deleteHotel, updateHotel, getHotels, getHotelbyID } = require('../Controllers/adminController')
const { verifyAdmin, verifyToken } = require('../Middlewares/userMiddleware')


adminRouter.post('/login', login)
adminRouter.post('/addHotel', addHotel)
adminRouter.delete('/deleteHotel/:id', verifyToken, verifyAdmin, deleteHotel)
adminRouter.post('./updateHotel/:id', verifyToken, verifyAdmin, updateHotel)
adminRouter.get('/getHotels', getHotels)
adminRouter.get('/getHotel/:hotelId', getHotelbyID)


module.exports = adminRouter;