import { createError } from './../utils/error.js';
import Users from '../models/Users.js'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';


// user registration 
export const sign_up = async (req, res, next) => {

    const email = req.body.email

    try {
        // 1st) 🟩 find the user if the user already exits in database
        const user = await Users.findOne({ email });
        if (user) return next(createError(500, "User already exist..."));

        // 2nd) 🟩 user plain password, hashing mechanism...
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(req.body.password, salt);

        // 3rd) 🟩 collect user info from Frontend & 
        // create a user {Object} upon this info...
        const newUser = new Users({
            // userName: req.body.userName,
            // email: req.body.email,
            ...req.body,
            password: hash,
        });

        // 4th) 🟩 data save into database
        await newUser.save();
        res.status(200).send("User has been created successfully...")

    } catch (error) {
        next(error)
    }
}

// user login
export const sign_in = async (req, res, next) => {

    const email = req.body.email
    const pass = req.body.password

    try {
        // 1st) 🟩 check that user email is exist of not...
        const user = await Users.findOne({ email });
        if (!user) return next(createError(404, "No user found..."));

        // 2nd) 🟩 check that user password with saved password that save into DB...
        const isPassCorrect = await bcrypt.compare(pass, user.password)
        if (!isPassCorrect) return next(createError(404, "Wrong Password..."));

        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT);

        // 3rd) 🟩 without {password, isAdmin} property, send all info into frontend...
        const { password, isAdmin, ...otherInfos } = user._doc;

        res
            .cookie('access_token', token, { httpOnly: true })
            .status(200)
            .send({ ...otherInfos });

    } catch (error) {
        next(error)
    }
}





export const forgotPassword = (req, res) => {
    const { email } = req.params;
  
    // Check if the email exists in the user collection
    Users.findOne({ email: email })
      .then((user) => {
        if (!user) {
          // Email does not exist
          return res.status(400).send({ message: 'Email not found' });
        }
  
        // Generate a temporary OTP
        const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
  
        // Save the OTP in the PasswordResetToken collection
        const resetToken = new PasswordResetToken({
          user: user._id,
          otp: otp,
          expiresAt: new Date(Date.now() + 600000), // OTP expires in 10 minutes
        });
  
        resetToken
          .save()
          .then(() => {
            // Send the OTP to the user's email
            sendOtpByEmail(email, otp);
  
            res.status(200).send({ message: 'OTP sent to email' });
          })
          .catch((err) => res.status(500).send({ message: 'Internal server error', error: err }));
      })
      .catch((err) => res.status(500).send({ message: 'Internal server error', error: err }));
  };
  
  
  function sendOtpByEmail(email, otp) {
    // Configure the email transporter
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  
    // Configure the email options
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: 'Password Reset OTP',
      text: `Your password reset OTP is: ${otp}`,
    };
  
    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
  
  export const resetPassword = async (req, res) => {
    try {
      const { email, otp, newPassword } = req.body;
  
      // Find the user based on the email
      const user = await Users.findOne({ email });
  
      if (!user) {
        return res.status(400).send({ message: 'Invalid email or OTP' });
      }
  
      const resetToken = await PasswordResetToken.findOne({ user: user._id, otp });
  
      if (!resetToken) {
        return res.status(400).send({ message: 'Invalid OTP' });
      }
  
      if (resetToken.expiresAt < Date.now()) {
        return res.status(400).send({ message: 'OTP has expired' });
      }
  
      // Remove the password reset token
      await PasswordResetToken.deleteOne({ _id: resetToken._id });
  
      // ... code to update the user's password ...
  
      res.status(200).send({ message: 'Password reset successful' });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Internal server error', error: error.message });
    }
  };