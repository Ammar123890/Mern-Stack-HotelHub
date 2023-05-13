const User = require('../Models/userModel')
const jwt = require('jsonwebtoken')

const signup = (req,res)=>{
    const {name, email, password} = req.body;

    const newUser = new User({name:name, email:email, password:password})
    newUser.save().then((user)=>{
        res.status(200).send({message:'Successfully added user',user:user})
    }).catch((err)=>res.status(400).send({message:'Error adding user',error:err}))

}

const login = (req,res)=>{
    const {email, password} = req.body;
    User.findOne({email:email}).then((user)=>{
        if(user){
            if(user.password==password){
                const token = jwt.sign({id:user._id},process.env.SECRET_KEY,{expiresIn:'24h'})
                res.status(200).send({message:'Successfully logged in',user:user,token:token})
            }else{
                res.status(400).send({message:'Invalid credentials'})
            }
        }else{
            res.status(400).send({message:'Invalid credentials'})
        }
    }).catch((err)=>{res.status(400).send({message:'Error logging in',error:err})})
}


module.exports = {login,signup}
