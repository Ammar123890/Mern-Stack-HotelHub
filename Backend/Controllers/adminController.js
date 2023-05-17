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
    const { name, location, city, state, country, stars, facilities, hotelImages } = req.body;

    // Validate the request data
    const hotelData = {
        name: name,
        location: location,
        city: city,
        state: state,
        country: country,
        stars: stars,
        facilities: facilities,
        hotelImages: hotelImages
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
    const { name, description, location, price ,facilities, hotelImages} = req.body;

    // Validate the request data
    const hotelData = {
        name: name,
        description: description,
        location: location,
        facilities:facilities,
        price: price,
        hotelImages:hotelImages
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

const getHotelbyID = async (req, res) => {
    const { hotelId } = req.params;
    try {
        // Find the hotel by ID
        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            return res.status(404).send({ message: 'Hotel not found.' });
        }
        res.status(200).send({ hotel });
    } catch (error) {
        res.status(400).send({ message: 'Error retrieving hotel.', error: error.message });
    }

}



module.exports = { login, addHotel, getHotelbyID, deleteHotel, updateHotel, getHotels}
