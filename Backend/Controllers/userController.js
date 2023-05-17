const User = require('../Models/userModel.js')
const jwt = require('jsonwebtoken')
const Hotel = require('../Models/hotelModel.js')
const Booking = require('../Models/bookingModel.js')
const signup = (req, res) => {
    const { username, email, password } = req.body;

    // Check if the email already exists in the user collection
    User.findOne({ email: email })
        .then((existingUser) => {
            if (existingUser) {
                // Email already exists
                return res.status(400).send({ message: 'Email already exists' });
            }
            // Create a new user
            const newUser = new User({ username: username, email: email, password: password });
            // Save the new user
            newUser
                .save()
                .then((user) => {
                    res.status(200).send({ message: 'Successfully added user', user: user });
                })
                .catch((err) => res.status(400).send({ message: 'Error adding user', error: err }));
        })
        .catch((err) => res.status(500).send({ message: 'Internal server error', error: err }));
};


const login = (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email: email }).then((user) => {
        if (user) {
            if (user.password == password) {
                const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '24h' })
                res.status(200).send({ message: 'Successfully logged in', user: user, token: token })
            } else {
                res.status(400).send({ message: 'Invalid credentials' })
            }
        } else {
            res.status(400).send({ message: 'Invalid credentials' })
        }
    }).catch((err) => { res.status(400).send({ message: 'Error logging in', error: err }) })
}

const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.json({
            err: "Pssst"
        });
    }
}

const getUserByID = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        res.json(user);
    } catch (error) {
        res.json("error")
    }
}
const addComment = (req, res) => {
    const { user_id } = req.params;
    const { hotel_id } = req.params;

    const { comment, commented_on, stars } = req.body;

    //check if booking has that user
    const booking = Booking.findOne({ user_id: user_id });
    if (!booking) {
        return res.status(`404`).send('User cannot write a comment as he never stayed')
    }

    User.findById(user_id).then(() => {
        Hotel.findById(hotel_id).then((hotel) => {
            const newComment = {
                booking_id: booking._id,
                comment: comment,
                commented_on: commented_on,
                stars: stars,
                commented_by: user_id,
            }
            hotel.comments.push(newComment);
            hotel.save();
        }
        )

    }).catch((err) => {
        res.status('404').send(err);
    });

}


module.exports = { login, signup, getUsers, getUserByID,addComment }
