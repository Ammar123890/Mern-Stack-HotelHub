const Room = require('../Models/roomModel');

// Create a new room
async function createRoom(req, res) {
    try {
        const { hotel_id, room_type, capacity, price_per_night } = req.body;
        const room = new Room({ hotel_id, room_type, capacity, price_per_night });
        const savedRoom = await room.save();
        res.json(savedRoom);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function addMultipleRooms(req, res) {
    console.log("first")
    try {
        const rooms = req.body; // Assuming an array of room objects is passed in the request body
        console.log("ss")
        // Validate the rooms array
        if (!Array.isArray(rooms)) {
            return res.status(400).json({ error: 'Invalid input. Expected an array of rooms.' });
        }
        console.log("tt")
        // Save each room to the database
        const savedRooms = [];
        console.log(rooms)
        for (const roomData of rooms) {
            const room = new Room(roomData);
            const savedRoom = await room.save();
            savedRooms.push(savedRoom);
        }

        res.json(savedRooms);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


// Get all rooms
async function getAllRooms(req, res) {
    try {
        const rooms = await Room.find();
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Get a single room by ID
async function getRoomById(req, res) {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }
        res.json(room);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Update a room
async function updateRoom(req, res) {
    try {
        const { hotel_id, room_type, capacity, price_per_night } = req.body;
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }
        room.hotel_id = hotel_id;
        room.room_type = room_type;
        room.capacity = capacity;
        room.price_per_night = price_per_night;
        const updatedRoom = await room.save();
        res.json(updatedRoom);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Delete a room
async function deleteRoom(req, res) {
    try {
        const room = await Room.findByIdAndRemove(req.params.id);
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }
        res.json({ message: 'Room deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

//delete multiple rooms
const deleteRooms = async (req, res) => {
    const { roomIDs } = req.body;

    try {
        // Loop through the room IDs and delete each room
        for (const roomID of roomIDs) {
            const room = await Room.findById(roomID);

            // If room doesn't exist, skip to the next one
            if (!room) {
                continue;
            }

            await room.remove();
        }

        res.sendStatus(204);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const getRoomsByHotel = async (req, res) => {
    const hotel_id = req.params.hotel_id;
    const rooms = await Room.find({hotel_id: hotel_id})
    if (rooms) {
        console.log(hotel_id)
        return res.send(rooms)
    }
    else {
        return res.status(404).json({ error: "No rooms found" })
    }

}

module.exports = {
    createRoom,
    getRoomsByHotel,
    getAllRooms,
    getRoomById,
    updateRoom,
    deleteRoom,
    addMultipleRooms, deleteRooms
};
