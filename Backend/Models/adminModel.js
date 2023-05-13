const mongoose = require('mongoose');	

const adminSchema = mongoose.Schema({

    email:{
        required: true,
        type: String
    },
    password:{
        required: true,
        type: String
    }
})

module.exports = mongoose.model('Admin', adminSchema);