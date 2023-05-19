const User = require('../../Models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const PasswordResetToken = require('../../Models/passwordResetModel');
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');



const signup = (req, res) => {
  const { username, email, password } = req.body;

  // Check if the email already exists in the user collection
  User.findOne({ email: email })
    .then((existingUser) => {
      if (existingUser) {
        // Email already exists
        return res.status(400).send({ message: 'Email already exists' });
      }
      // Hash the password
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          return res.status(500).send({ message: 'Error hashing password', error: err });
        }
        // Create a new user with the hashed password
        const newUser = new User({ username: username, email: email, password: hashedPassword });
        // Save the new user
        newUser
          .save()
          .then((user) => {
            res.status(200).send({ message: 'Successfully added user', user: user });
          })
          .catch((err) => res.status(400).send({ message: 'Error adding user', error: err }));
      });
    })
    .catch((err) => res.status(500).send({ message: 'Internal server error', error: err }));
};



const login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email: email }).then((user) => {
    if (user) {
      // Compare the hashed password
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          return res.status(500).send({ message: 'Error comparing passwords', error: err });
        }
        if (result) {
          const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '24h' });
          res.status(200).send({ message: 'Successfully logged in', user: user, token: token });
        } else {
          res.status(400).send({ message: 'Invalid credentials' });
        }
      });
    } else {
      res.status(400).send({ message: 'Invalid credentials' });
    }
  }).catch((err) => { res.status(400).send({ message: 'Error logging in', error: err }) });
};



const forgotPassword = (req, res) => {
  const { email } = req.params;

  // Check if the email exists in the user collection
  User.findOne({ email: email })
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




// const resetPassword = (req, res) => {
//   const { email, otp, newPassword } = req.body;

//   // Find the user based on the email and OTP
//   User.findOne({ email: email })
//     .then((user) => {
//       if (!user) {
//         // User not found or invalid OTP
//         return res.status(400).send({ message: 'Invalid email or OTP' });
//       }

//       // Find the password reset token in the collection
//       PasswordResetToken.findOne({ user: user._id, otp: otp })
//         .then((resetToken) => {
//           if (!resetToken) {
//             // Invalid OTP
//             return res.status(400).send({ message: 'Invalid OTP' });
//           }

//           // Check if the OTP has expired
//           if (resetToken.expiresAt < Date.now()) {
//             // OTP has expired
//             return res.status(400).send({ message: 'OTP has expired' });
//           }

//           // Hash the new password
//           bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
//             if (err) {
//               return res.status(500).send({ message: 'Error hashing password', error: err });
//             }

//             // Update the user's password
//             user.password = hashedPassword;
//             user.save()
//               .then(() => {
//                 // Delete the password reset token
//                 resetToken.remove()
//                   .then(() => {
//                     res.status(200).send({ message: 'Password reset successful' });
//                   })
//                   .catch((err) => res.status(500).send({ message: 'Internal server error', error: err }));
//               })
//               .catch((err) => res.status(500).send({ message: 'Internal server error', error: err }));
//           });
//         })
//         .catch((err) => res.status(500).send({ message: 'Internal server error', error: err }));
//     })
//     .catch((err) => res.status(500).send({ message: 'Internal server error', error: err }));
// };



const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Find the user based on the email
    const user = await User.findOne({ email });

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

// Export the functions
module.exports = { signup, login, forgotPassword, resetPassword };


