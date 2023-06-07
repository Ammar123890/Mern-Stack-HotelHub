import { useState } from 'react';
import { sendResetPasswordOTP, verifyResetPasswordOTP } from '../../hooks/useFetch';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOTP] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSendOTP = async () => {
    try {
      await sendResetPasswordOTP(email);
      // OTP sent successfully, show success message or navigate to the next step
    } catch (error) {
      setErrorMessage('Failed to send OTP. Please try again.');
    }
  };

  const handleResetPassword = async () => {
    try {
      await verifyResetPasswordOTP(email, otp, newPassword);
      // Password reset successful, show success message or navigate to the login page
    } catch (error) {
      setErrorMessage('Failed to reset password. Please try again.');
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      {errorMessage && <p>{errorMessage}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleSendOTP}>Send OTP</button>

      <input
        type="text"
        placeholder="OTP"
        value={otp}
        onChange={(e) => setOTP(e.target.value)}
      />
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button onClick={handleResetPassword}>Reset Password</button>
    </div>
  );
};

export default ForgotPassword;
