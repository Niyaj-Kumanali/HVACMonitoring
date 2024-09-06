import React, { useEffect, useState } from 'react';
import './ResetPassword.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { resetPasswordByToken } from '../../api/loginApi';

const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState<string | null>(null);

  // const {resetToken, userId} = location.state

  const handleReset = async () => {
    if (newPassword === confirmPassword) {
      const passBody = {
        password: newPassword,
        resetToken: token,
      };

      const response = await resetPasswordByToken(passBody);
      console.log(response);
      setTimeout(() => {
        navigate(`/login`);
      }, 500);
    } else {
      alert('Passwords do not match');
    }
    console.log('handleReset');
  };

  const handleCancel = () => {
    navigate(`/login`);
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tokenParam = searchParams.get('token');
    setToken(tokenParam);
  }, [location]);

  return (
    <div className="reset-password">
      <div className="reset-password-container">
        <h2>Password reset</h2>

        <div className="input-divv">
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
        </div>

        <div className="button-group">
          <button onClick={handleReset} className="primary-button">
            Reset Password
          </button>
          <button className="secondary-button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
