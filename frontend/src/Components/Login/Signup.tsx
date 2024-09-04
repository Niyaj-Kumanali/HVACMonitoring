import React, { useEffect, useRef, useState } from 'react';
import './Login.css';
import waveImg from '../../assets/wave.png';
import bgImg from '../../assets/bg.svg';
import avatarImg from '../../assets/avatar.svg';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';
import Loader from '../Loader/Loader';
import { Tenant, User } from '../../types/thingsboardTypes';
import { CreateSignUpUser } from '../../api/signupAPIs';
import { getActivationLink } from '../../api/userApi';
import axios from 'axios';

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [focusedFields, setFocusedFields] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    style: {} as React.CSSProperties,
    Transition: Slide,
  });
  const [isLoading, setIsLoading] = useState(true);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleInputChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [field]: e.target.value });
    };

  const handleFocus = (field: keyof typeof focusedFields) => () => {
    setFocusedFields((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur =
    (field: keyof typeof focusedFields) =>
    (e: React.FocusEvent<HTMLInputElement>) => {
      if (e.target.value === '') {
        setFocusedFields((prev) => ({ ...prev, [field]: false }));
      }
    };

  const setUserPassword = async (activateToken: string, password: string) => {
    try {
      const response = await axios.post(
        'http://3.111.205.170:8085/login/createPassword',
        {
          activateToken,
          password,
          confirmPassword: password,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      return response;
    } catch (error) {
      console.error('Error setting password:', error);
      throw error;
    }
  };

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password
    ) {
      setSnackbar({
        ...snackbar,
        open: true,
        message: 'All fields are required',
        style: { backgroundColor: 'red' },
      });
      return;
    }

    setLoading(true);

    try {
      const userBody: User = {
        email: formData.email,
        authority: 'TENANT_ADMIN',
        firstName: formData.firstName,
        lastName: formData.lastName,
        password: formData.password,
        phone: '',
        additionalInfo: {},
      };

      const tenant: Tenant = {
        title: 'TenantUser',
      };

      const createdUser = await CreateSignUpUser(tenant, userBody);
      const responseActivationLink = await getActivationLink(
        createdUser.data.id?.id
      );

      const activateToken = responseActivationLink.data.split('=')[1];
      const res = await setUserPassword(activateToken, formData.password);

      if (res.status === 200) {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
        });
        setSnackbar({
          ...snackbar,
          open: true,
          message: 'Sign-up successful',
          style: { backgroundColor: 'green' },
        });
      } else {
        setSnackbar({
            ...snackbar,
            open: true,
            message: 'Activation failed. Please try again later.',
            style: { backgroundColor: 'yellow' },
          });
      }
    } catch (error) {
      setSnackbar({
        ...snackbar,
        open: true,
        message: 'An error occurred. Please try again.',
        style: { backgroundColor: 'red' },
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleNavigation = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    if (loading) {
      window.addEventListener('beforeunload', handleNavigation);
    } else {
      window.removeEventListener('beforeunload', handleNavigation);
    }

    return () => {
      window.removeEventListener('beforeunload', handleNavigation);
    };
  }, [loading]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleCloseSnackbar = () => {
    setSnackbar((prevState) => ({ ...prevState, open: false }));
  };

  return isLoading ? (
    <div className="loading">
      <Loader />
    </div>
  ) : (
    <div className="login-page">
      <img className="wave" src={waveImg} alt="wave" />
      <div className="container">
        <div className="img">
          <img src={bgImg} alt="background" />
        </div>

        <div className="login-content">
          <form onSubmit={handleSignUp} autoComplete="on">
            <img src={avatarImg} alt="avatar" />
            <h2 className="title">Sign Up</h2>

            <div
              className={`input-div one ${
                focusedFields.firstName ? 'focus' : ''
              }`}
            >
              <div className="i">
                <i className="fas fa-user"></i>
              </div>
              <div className="div">
                <h5>First Name</h5>
                <input
                  type="text"
                  className="input"
                  value={formData.firstName}
                  onChange={handleInputChange('firstName')}
                  onFocus={handleFocus('firstName')}
                  onBlur={handleBlur('firstName')}
                  autoComplete="given-name"
                  ref={usernameRef}
                />
              </div>
            </div>

            <div
              className={`input-div one ${
                focusedFields.lastName ? 'focus' : ''
              }`}
            >
              <div className="i">
                <i className="fas fa-user"></i>
              </div>
              <div className="div">
                <h5>Last Name</h5>
                <input
                  type="text"
                  className="input"
                  value={formData.lastName}
                  onChange={handleInputChange('lastName')}
                  onFocus={handleFocus('lastName')}
                  onBlur={handleBlur('lastName')}
                  autoComplete="family-name"
                />
              </div>
            </div>

            <div
              className={`input-div one ${focusedFields.email ? 'focus' : ''}`}
            >
              <div className="i">
                <i className="fas fa-envelope"></i>
              </div>
              <div className="div">
                <h5>Email</h5>
                <input
                  type="email"
                  className="input"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  onFocus={handleFocus('email')}
                  onBlur={handleBlur('email')}
                  autoComplete="email"
                />
              </div>
            </div>

            <div
              className={`input-div pass ${
                focusedFields.password ? 'focus' : ''
              }`}
            >
              <div className="i">
                <i className="fas fa-lock"></i>
              </div>
              <div className="div">
                <h5>Password</h5>
                <input
                  type="password"
                  className="input"
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  onFocus={handleFocus('password')}
                  onBlur={handleBlur('password')}
                  autoComplete="new-password"
                  ref={passwordRef}
                />
              </div>
            </div>

            <LoadingButton
              type="submit"
              size="small"
              loading={loading}
              loadingPosition="start"
              startIcon={<SaveIcon />}
              variant="contained"
              sx={{ width: '150px', height: '50px', marginTop: '40px' }}
              className="btn"
            >
              <span>Sign up</span>
            </LoadingButton>

            <Snackbar
              open={snackbar.open}
              onClose={handleCloseSnackbar}
              TransitionComponent={snackbar.Transition}
              message={snackbar.message}
              key={snackbar.Transition.name}
              autoHideDuration={1500}
              ContentProps={{
                style: { ...snackbar.style, textAlign: 'center' },
              }}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
