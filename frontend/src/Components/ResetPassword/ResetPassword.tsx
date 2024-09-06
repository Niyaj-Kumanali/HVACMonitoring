import React, { useState } from 'react';
import './ResetPassword.css'; 
import { useLocation, useNavigate } from 'react-router-dom'
import { resetPassword, setPassword } from '../../api/loginApi';


const ResetPassword: React.FC = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate()
    const location = useLocation()
    const {email, resetToken, userId} = location.state

    const handleReset = async() => {
        if (newPassword === confirmPassword) {

            const passBody = {
                user_id: userId,
                password: newPassword,
                enabled: true,
                activateToken: resetToken
              }
        
              const response = await setPassword(passBody)
              console.log(response)
            // Handle password reset logic here
            alert('Password reset successfully');
            navigate(`/login`)
        } else {
            console.log('Passwords do not match');
        }
    };

    return (
        <div className="reset-password-container">
            <h2>Password reset</h2>
            <div className="input-group">
                <span className="icon">🔒</span>
                <input
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
            </div>
            <div className="input-group">
                <span className="icon">🔒</span>
                <input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </div>
            <div className="button-group">
                <button onClick={handleReset} className="primary-button">Reset Password</button>
                <button className="secondary-button">Cancel</button>
            </div>
        </div>
    );
};

export default ResetPassword;