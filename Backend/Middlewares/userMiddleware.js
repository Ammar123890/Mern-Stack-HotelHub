const jwt = require('jsonwebtoken')
const User = require('../Models/userModel')
const Admin = require('../Models/adminModel')


const verifyToken = (req,res,next)=>{
    // const {token} = req.headers
    const token = req.headers['token']
    if(token){
        jwt.verify(token,process.env.SECRET_KEY,(err,decoded)=>{
            if(err){
                res.status(400).send({message:'Invalid token',error:err})
            }else{
                req.decoded = decoded
                next()
            }
        })
    }else{
        res.status(400).send({message:'Invalid token'})
    }
}

const verifyUser = (req,res,next)=>{
    const {token} = req.headers
    if(token){
        jwt.verify(token,process.env.SECRET_KEY,(err,decoded)=>{
            if(err){
                res.status(400).send({message:'Invalid token',error:err})
            }else{
                req.decoded = decoded
                User.findById(decoded.id).then((user)=>{
                    if(user){
                        next()
                    }else{
                        res.status(400).send({message:'Invalid user'})
                    }
                }).catch((err)=>{res.status(400).send({message:'Error finding user',error:err})})
            }
        })
    }else{
        res.status(400).send({message:'Invalid token'})
    }
}


const verifyAdmin = (req,res,next)=>{
    const {token} = req.headers
    if(token){
        jwt.verify(token,process.env.SECRET_KEY,(err,decoded)=>{
            if(err){
                res.status(400).send({message:'Invalid token',error:err})
            }else{
                req.decoded = decoded
                Admin.findById(decoded.id).then((admin)=>{
                    if(admin){
                        next()
                    }else{
                        res.status(400).send({message:'Invalid admin'})
                    }
                }).catch((err)=>{res.status(400).send({message:'Error finding admin',error:err})})
            }
        })
    }else{
        res.status(400).send({message:'Invalid token'})
    }
}



module.exports = {verifyToken,verifyUser,verifyAdmin}