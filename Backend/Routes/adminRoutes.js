const adminRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const {login,addHotel,deleteHotel, updateHotel, getHotels, addRoomToHotel,getRoomsFromHotel
, updateHotelRoom,deleteHotelRoom, getHotelbyID} = require('../Controllers/adminController')
const {verifyAdmin, verifyToken} = require('../Middlewares/userMiddleware')


adminRouter.post('/login',login)
adminRouter.post('/addHotel', addHotel)
adminRouter.delete('/deleteHotel/:id', verifyToken, verifyAdmin, deleteHotel)
adminRouter.post('./updateHotel/:id', verifyToken, verifyAdmin, updateHotel)
adminRouter.get('/getHotels', getHotels)
adminRouter.post('/addRoomToHotel/:id/newRoom', verifyToken, verifyAdmin, addRoomToHotel)
adminRouter.get('/getRoomsFromHotel/:id', verifyToken, verifyAdmin, getRoomsFromHotel)
adminRouter.get('./updateHotelRooms/:id/room/:roomNumber', verifyToken, verifyAdmin, updateHotelRoom)
adminRouter.delete('/deleteHotel/:id/room/:roomNumber', verifyToken, verifyAdmin, deleteHotelRoom)
adminRouter.get('/getHotel/:hotelId', getHotelbyID)


module.exports = adminRouter;