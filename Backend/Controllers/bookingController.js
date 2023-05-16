const Booking = require('../Models/bookingModel.js');
const Room = require('../Models/roomModel.js')
// Create a new booking
async function createBooking(req, res) {
  try {
    const {
      user_id,
      room_id,
      check_in_date,
      check_out_date,
      guests_count
    } = req.body;

    // Check if there is an existing booking for the same room at the same time
    const existingBooking = await Booking.findOne({
      room_id: room_id,
      $or: [
        {
          check_in_date: { $lt: check_out_date },
          check_out_date: { $gt: check_in_date }
        },
        {
          check_in_date: { $gte: check_in_date, $lt: check_out_date }
        },
        {
          check_out_date: { $gt: check_in_date, $lte: check_out_date }
        }
      ]
    });
    if (existingBooking) {
      return res.status(400).json({ error: 'Booking for the same room at the same time already exists' });
    }

    // Check if the number of guests exceeds the room capacity
    const room = await Room.findById(room_id);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    if (guests_count > room.capacity) {
      return res.status(400).json({ error: 'Number of guests exceeds the room capacity' });
    }
    const numberOfDays = calculateNumberOfDays(check_in_date, check_out_date);
    const total_price = room.price_per_night * numberOfDays;
    const booking = new Booking({
      user_id,
      room_id,
      check_in_date,
      check_out_date,
      guests_count,
      total_price
    });
    const savedBooking = await booking.save();
    res.json(savedBooking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
function calculateNumberOfDays(checkInDate, checkOutDate) {
  const oneDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day

  // Convert the check-in and check-out dates to JavaScript Date objects
  const startDate = new Date(checkInDate);
  const endDate = new Date(checkOutDate);

  // Calculate the difference in milliseconds between the two dates
  const timeDifference = endDate.getTime() - startDate.getTime();

  // Calculate the number of days by dividing the time difference by the number of milliseconds in a day
  const numberOfDays = Math.round(timeDifference / oneDay);

  return numberOfDays;
}


// Get all bookings
async function getAllBookings(req, res) {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get a single booking by ID
async function getBookingById(req, res) {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Update a booking
async function updateBooking(req, res) {
  try {
    const { user_id, room_id, check_in_date, check_out_date, guests_count, total_price } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check if there is an existing booking for the same room at the same time
    const existingBooking = await Booking.findOne({
      room_id: room_id,
      _id: { $ne: req.params.id },
      $or: [
        {
          check_in_date: { $lt: check_out_date },
          check_out_date: { $gt: check_in_date }
        },
        {
          check_in_date: { $gte: check_in_date, $lt: check_out_date }
        },
        {
          check_out_date: { $gt: check_in_date, $lte: check_out_date }
        }
      ]
    });
    if (existingBooking) {
      return res.status(400).json({ error: 'Booking for the same room at the same time already exists' });
    }

    // Check if the number of guests exceeds the room capacity
    const room = await Room.findById(room_id);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    if (guests_count > room.capacity) {
      return res.status(400).json({ error: 'Number of guests exceeds the room capacity' });
    }

    booking.user_id = user_id;
    booking.room_id = room_id;
    booking.check_in_date = check_in_date;
    booking.check_out_date = check_out_date;
    booking.guests_count = guests_count;
    booking.total_price = total_price;
    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


// Delete a booking
async function deleteBooking(req, res) {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking
};
