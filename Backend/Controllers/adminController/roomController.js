
const Hotel = require('../../Models/hotelModel')
const addRoomToHotel = (req, res) => {
    const { id } = req.params;
    const { room } = req.body;

    // Validate the request data
    if (!room || typeof room !== 'object') {
        res.status(400).send({ message: 'Validation Error', error: 'Invalid room data' });
        return;
    }

    // Add the room to the hotel document
    Hotel.findByIdAndUpdate(id, { $push: { rooms: room } })
        .then((hotel) => {
            res.status(200).send({ message: 'Successfully added room to hotel', hotel: hotel });
        })
        .catch((err) => {
            res.status(400).send({ message: 'Error adding room to hotel', error: err });
        });
};


const getRoomsFromHotel = (req, res) => {
    const { id } = req.params;

    // Get the hotel document
    Hotel.findById(id)
        .then((hotel) => {
            res.status(200).send({ message: 'Successfully retrieved rooms from hotel', rooms: hotel.rooms });
        })
        .catch((err) => {
            res.status(400).send({ message: 'Error retrieving rooms from hotel', error: err });
        });
}


const updateHotelRoom = async (req, res) => {
    const { id, roomNumber } = req.params;
    const { details, roomType, roomPrice, roomAvailability } = req.body;

    try {
        // Find the hotel by ID
        const hotel = await Hotel.findById(id);

        // Find the room by roomNumber
        const roomIndex = hotel.rooms.findIndex((room) => room.roomNumber === roomNumber);

        if (roomIndex === -1) {
            return res.status(404).send({ message: 'Room not found in the hotel.' });
        }

        // Update the room details
        hotel.rooms[roomIndex].details = details;
        hotel.rooms[roomIndex].roomType = roomType;
        hotel.rooms[roomIndex].roomPrice = roomPrice;
        hotel.rooms[roomIndex].roomAvailability = roomAvailability;

        // Save the updated hotel
        const updatedHotel = await hotel.save();

        res.status(200).send({ message: 'Room updated successfully.', hotel: updatedHotel });
    } catch (error) {
        res.status(400).send({ message: 'Error updating room.', error: error.message });
    }

}


const deleteHotelRoom = async (req, res) => {
    const { id, roomNumber } = req.params;

    try {
        // Find the hotel by ID
        const hotel = await Hotel.findById(id);

        // Find the room by roomNumber
        const roomIndex = hotel.rooms.findIndex((room) => room.roomNumber === roomNumber);

        if (roomIndex === -1) {
            return res.status(404).send({ message: 'Room not found in the hotel.' });
        }

        // Delete the room from the hotel
        hotel.rooms.splice(roomIndex, 1);

        // Save the updated hotel
        const updatedHotel = await hotel.save();

        res.status(200).send({ message: 'Room deleted successfully.', hotel: updatedHotel });
    } catch (error) {
        res.status(400).send({ message: 'Error deleting room.', error: error.message });
    }
}






module.exports = { 
 
    addRoomToHotel, 
    getRoomsFromHotel, 
    updateHotelRoom, 
    deleteHotelRoom
 }
