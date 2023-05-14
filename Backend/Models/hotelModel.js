const mongoose = require('mongoose');
const hotelSchema = mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    location: {
        required: true,
        type: String
    },
    city: {
        required: true,
        type: String
    },
    state: {
        required: true,
        type: String
    },
    country: {
        required: true,
        type: String
    },
    stars: {
        required: true,
        type: Number
    },
    rooms: [
        {
            roomNumber: String,
            detaitls: String,
            roomType: String,
            roomPrice: Number,
            roomAvailability: Boolean
        }

    ],
    faclities: [
        {
            facilityName: String,
            facilityAvailability: Boolean
        }
    ],
    hotelImages: [
        {
            imageUrl: String
        }
    ]
})


module.exports = mongoose.model('Hotel', hotelSchema);