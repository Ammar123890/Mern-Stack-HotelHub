const adminRouter_room = require('express').Router();
const {

    addRoomToHotel,
    getRoomsFromHotel,
    updateHotelRoom,
    deleteHotelRoom,

} = require('../../Controllers/adminController/roomController')
const { verifyAdmin, verifyToken } = require('../../Middlewares/userMiddleware')


adminRouter_room.post('/addRoomToHotel/:id/newRoom', verifyToken, verifyAdmin, addRoomToHotel)
adminRouter_room.get('/getRoomsFromHotel/:id', verifyToken, verifyAdmin, getRoomsFromHotel)
adminRouter_room.get('/updateHotelRooms/:id/room/:roomNumber', verifyToken, verifyAdmin, updateHotelRoom)
adminRouter_room.delete('/deleteHotel/:id/room/:roomNumber', verifyToken, verifyAdmin, deleteHotelRoom)




module.exports = adminRouter_room;