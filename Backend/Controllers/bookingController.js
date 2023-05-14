const Booking = require('../models/booking');
const User = require('../models/user');
const Hotel = require('../models/hotel');

const addNewBooking = async (userId, hotelId, checkInDate,
    checkOutDate, numberOfRooms, numberOfGuests) => {
    try {
        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Find the hotel
        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            throw new Error('Hotel not found');
        }

        // Check if the hotel has enough available rooms
        if (numberOfRooms > hotel.rooms.length) {
            throw new Error('Not enough available rooms');
        }

        // Create the booking
        const booking = new Booking({
            user: userId,
            hotel: hotelId,
            checkInDate,
            checkOutDate,
            numberOfRooms,
            numberOfGuests,
        });

        // Save the booking
        await booking.save();

        // Associate the booking with the user
        user.bookings.push(booking._id);
        await user.save();

        // Update the hotel's room availability
        const bookedRoomNumbers = hotel.rooms
            .filter(room => room.roomAvailability)
            .slice(0, numberOfRooms) // Book the first available rooms
            .map(room => room.roomNumber);

        hotel.rooms.forEach(room => {
            if (bookedRoomNumbers.includes(room.roomNumber)) {
                room.roomAvailability = false; // Set room as booked
            }
        });

        await hotel.save();

        return booking;
    } catch (error) {
        throw new Error('Failed to create booking: ' + error.message);
    }
}


const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.params.userId });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const getBookingByID = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.bookingId);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        res.json(booking);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const updateBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(
            req.params.bookingId,
            req.body,
            { new: true }
        );
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        res.json(booking);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.bookingId);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        res.sendStatus(204);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}



module.exports = { addNewBooking, updateBooking, deleteBooking, getBookingByID, getBookings }
