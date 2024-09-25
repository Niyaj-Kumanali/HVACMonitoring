import React, { useEffect, useState } from 'react';
import './ResetPassword.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { resetPasswordByToken } from '../../api/loginApi';
import { Button } from '@mui/material';

const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isExpired, setIsExpired] = useState<boolean>(false);

  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState<string | null>(null);

  const handleReset = async () => {
    if (!newPassword || !confirmPassword) {
      setErrorMessage('Please fill all the required fields');
      return;
    }

    if (newPassword === confirmPassword) {
      const passBody = {
        password: newPassword,
        resetToken: token,
      };

      try {
        const response = await resetPasswordByToken(passBody);

        if (response.status === 200) {
          setMessage(
            'Password reset successfully. You will be redirected to the login page.'
          );
          setTimeout(() => {
            navigate(`/login`);
          }, 500);
        } else {
          setErrorMessage(response.data.message || 'An error occurred.');
        }
      } catch (error: any) {
        setErrorMessage('An error occurred while resetting the password.');
        console.error('An error occurred while resetting the password.',error);
        if (error?.status === 401) {
          setErrorMessage(error.message);
          setIsExpired(true);
        }
      }
    } else {
      setErrorMessage('Passwords do not match');
    }
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
      {isExpired ? (
        <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
          <p style={{fontSize: '32px'}}>Reset token has expired.</p>
          <Button>
            <Link to="/login">Go to login</Link>
          </Button>
        </div>
      ) : (
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
                required
              />
            </div>
            <div className="input-group">
              <span className="icon">🔒</span>
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
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

          {message && <div className="message success">{message}</div>}
          {errorMessage && <div className="message error">{errorMessage}</div>}
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
