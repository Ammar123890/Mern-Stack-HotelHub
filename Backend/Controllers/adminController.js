const Admin = require('../Models/adminModel')
const jwt = require('jsonwebtoken')
const Hotel = require('../Models/hotelModel')


const login = (req, res) => {
    const { email, password } = req.body;
    Admin.findOne({ email: email }).then((admin) => {
        if (admin) {
            if (admin.password == password) {
                const token = jwt.sign({ id: admin._id }, process.env.SECRET_KEY, { expiresIn: '24h' })
                res.status(200).send({ message: 'Successfully logged in', admin: admin, token: token })
            } else {
                res.status(400).send({ message: 'Invalid credentials' })
            }
        } else {
            res.status(400).send({ message: 'Invalid credentials' })
        }
    }).catch((err) => { res.status(400).send({ message: 'Error logging in', error: err }) })
}

const addHotel = (req, res) => {
    const { name, description, location, price, rooms, amenities } = req.body;

    // Validate the request data
    const hotelData = {
        name: name,
        description: description,
        location: location,
        price: price,
        rooms: rooms,
        amenities: amenities
    };
    const newHotel = new Hotel(hotelData);
    const validationError = newHotel.validateSync();

    if (validationError) {
        const errorMessage = validationError.errors[Object.keys(validationError.errors)[0]].message;
        res.status(400).send({ message: 'Validation Error', error: errorMessage });
        return;
    }

    // Save the new hotel document
    newHotel.save()
        .then((hotel) => {
            res.status(200).send({ message: 'Successfully added hotel', hotel: hotel });
        })
        .catch((err) => {
            res.status(400).send({ message: 'Error adding hotel', error: err });
        });
};


const deleteHotel = (req, res) => {
    const { id } = req.params;
    Hotel.findByIdAndDelete(id)
        .then((hotel) => {
            res.status(200).send({ message: 'Successfully deleted hotel', hotel: hotel });
        })
        .catch((err) => {
            res.status(400).send({ message: 'Error deleting hotel', error: err });
        });
}


const updateHotel = (req, res) => {
    const { id } = req.params;
    const { name, description, location, price, rooms, amenities } = req.body;

    // Validate the request data
    const hotelData = {
        name: name,
        description: description,
        location: location,
        price: price,
        rooms: rooms,
        amenities: amenities
    };
    const newHotel = new Hotel(hotelData);
    const validationError = newHotel.validateSync();

    if (validationError) {
        const errorMessage = validationError.errors[Object.keys(validationError.errors)[0]].message;
        res.status(400).send({ message: 'Validation Error', error: errorMessage });
        return;
    }

    // Update the hotel document
    Hotel.findByIdAndUpdate(id, hotelData)
        .then((hotel) => {
            res.status(200).send({ message: 'Successfully updated hotel', hotel: hotel });
        })
        .catch((err) => {
            res.status(400).send({ message: 'Error updating hotel', error: err });
        });
}

const getHotels = (req, res) => {
    Hotel.find()
        .then((hotels) => {
            res.status(200).send({ message: 'Successfully retrieved hotels', hotels: hotels });
        })
        .catch((err) => {
            res.status(400).send({ message: 'Error retrieving hotels', error: err });
        });
}

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

const getHotelById = async (req, res) => 
{
    const { id } = req.params;
    try {
        const hotel = await Hotel.findById(id);
        res.status(200).send({ message: 'Successfully retrieved hotel', hotel: hotel });
    } catch (error) {
        res.status(400).send({ message: 'Error retrieving hotel', error: error });
    }
}




module.exports = { 
    login, 
    addHotel, 
    deleteHotel, 
    updateHotel, 
    getHotels, 
    addRoomToHotel, 
    getRoomsFromHotel, 
    updateHotelRoom, 
    deleteHotelRoom,
    getHotelById
 }
