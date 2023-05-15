const Booking = require('../Models/bookingModel.js');
const User = require('../Models/userModel.js');
const Hotel = require('../Models/hotelModel.js');

const addNewBooking = async (req, res) => {
  const { userId, hotelId, checkInDate, checkOutDate, numberOfRooms, numberOfGuests } = req.body;

  try {
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find the hotel
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    // Check if the hotel has enough available rooms
    const availableRooms = hotel.TotalRooms - getBookedRoomCount(hotel, checkInDate, checkOutDate);
    if (numberOfRooms > availableRooms) {
      return res.status(400).json({ error: 'Not enough available rooms' });
    }

    // Check if the number of guests does not exceed room capacity
    if (numberOfGuests > numberOfRooms * 3) {
      return res.status(400).json({ error: 'Number of guests exceeds room capacity' });
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
    updateRoomAvailability(hotel, checkInDate, checkOutDate, numberOfRooms);

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Helper function to get the count of booked rooms within the given duration
function getBookedRoomCount(hotel, checkInDate, checkOutDate) {
  return hotel.rooms.reduce((count, room) => {
    if (!room.roomAvailability) {
      const bookedDates = room.bookings.map(booking => ({
        checkInDate: booking.checkInDate,
        checkOutDate: booking.checkOutDate,
      }));

      const isBooked = bookedDates.some(
        bookingDates =>
          (checkInDate >= bookingDates.checkInDate && checkInDate <= bookingDates.checkOutDate) ||
          (checkOutDate >= bookingDates.checkInDate && checkOutDate <= bookingDates.checkOutDate) ||
          (checkInDate <= bookingDates.checkInDate && checkOutDate >= bookingDates.checkOutDate)
      );

      if (isBooked) {
        return count + 1;
      }
    }

    return count;
  }, 0);
}


// Helper function to update room availability based on booking dates
function updateRoomAvailability(hotel, checkInDate, checkOutDate, numberOfRooms) {
  const availableRooms = hotel.rooms.filter(room => room.roomAvailability);

  for (let i = 0; i < availableRooms.length; i++) {
    const room = availableRooms[i];
    const overlappingBookings = room.bookings.filter(
      booking =>
        (checkInDate >= booking.checkInDate && checkInDate <= booking.checkOutDate) ||
        (checkInDate <= booking.checkOutDate) ||
        (checkInDate <= booking.checkInDate && checkOutDate >= booking.checkOutDate)
    );

    if (overlappingBookings.length < numberOfRooms) {
      // Book the room
      room.bookings.push({
        checkInDate,
        checkOutDate,
      });

      if (overlappingBookings.length + 1 === numberOfRooms) {
        break; // All required rooms have been booked
      }
    }
  }

  // Save the updated hotel
  return hotel.save();
}


const getBookings = async (req, res) => {
  const { userId } = req.params;

  try {
    const bookings = await Booking.find({ 'user.userID': userId });

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
