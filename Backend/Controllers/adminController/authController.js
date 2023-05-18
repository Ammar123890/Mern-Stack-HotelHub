const Admin = require('../../Models/adminModel')
const jwt = require('jsonwebtoken')



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


module.exports = { 
    login
 }
