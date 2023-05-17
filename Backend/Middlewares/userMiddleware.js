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


const verifyResetToken = (req, res, next) => {
    const { token } = req.body;
  
    // Verify the token
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(400).send({ message: 'Invalid token' });
      }
  
      // Find the token in the PasswordResetToken collection
      PasswordResetToken.findOne({ token: token })
        .populate('user')
        .exec()
        .then((resetToken) => {
          if (!resetToken) {
            return res.status(400).send({ message: 'Invalid or expired token' });
          }
  
          // Check if the token has expired
          if (resetToken.expiresAt < Date.now()) {
            return res.status(400).send({ message: 'Token has expired' });
          }
  
          // Pass the user object to the next middleware/controller
          req.user = resetToken.user;
          next();
        })
        .catch((err) => res.status(500).send({ message: 'Internal server error', error: err }));
    });
  };
  



module.exports = {verifyToken,verifyUser,verifyAdmin, verifyResetToken}