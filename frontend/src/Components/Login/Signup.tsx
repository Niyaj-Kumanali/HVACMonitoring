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
import { Link, useNavigate } from 'react-router-dom';
import thingsboardAPI from '../../api/thingsboardAPI';
import { useDispatch } from 'react-redux';
import { set_Accesstoken } from '../../Redux/Action/Action';
import { getActivationLink } from '../../api/userApi';
import { getResetTokenByEmail, setPassword } from '../../api/loginApi';

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [focusedFields, setFocusedFields] = useState({
    firstName: true,
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
  const firstNameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch()
  const navigate = useNavigate()

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


  const login = async (username: string, password: string): Promise<string> => {
    try {
      const response = await thingsboardAPI.post<{ token: string }>(
        '/auth/login',
        { username, password }
      );
      const token = response.data.token;
      localStorage.setItem('token', token);
      dispatch(set_Accesstoken(token));
      return token;
    } catch (error) {
      console.error('Login failed', error);
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
        message: 'Please fill all fields.',
        style: { backgroundColor: 'red' },
      });
      return;
    }

    setLoading(true);

    try{
      const response = await getResetTokenByEmail(formData.email)
      if (response.status == 200) {
        setSnackbar({
          ...snackbar,
          open: true,
          message: 'User with this email exists.',
          style: { backgroundColor: 'red' },
        });
        setLoading(false)
        return
      }
    }catch(error){
      error
    }



    try {
      const userBody: User = {
        email: formData.email,
        authority: 'TENANT_ADMIN',
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: '',
        additionalInfo: {},
      };

      const tenant: Tenant = {
        title: 'TenantUser',
      };

      const createdUser = await CreateSignUpUser(tenant, userBody);
      console.log(createdUser);
      console.log("User created")
      const activationLinkResponse = await getActivationLink(createdUser?.data.id?.id)
      const activateToken = activationLinkResponse.data.split("=")[1]
      const passBody = {
        user_id: createdUser?.data.id?.id || "",
        password: formData.password,
        activateToken: activateToken
      }

      const response = await setPassword(passBody)

      if (response.status === 200) {
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
        await login(formData.email, formData.password)
        navigate('/dashboards')
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
        message: 'An error occurred. Please try again later.',
        style: { backgroundColor: 'red' },
      });
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (firstNameRef.current) {
      firstNameRef.current.focus();
    }
  }, [isLoading]);

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
              className={`input-div one ${focusedFields.firstName ? 'focus' : ''
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
                  ref={firstNameRef}
                />
              </div>
            </div>

            <div
              className={`input-div one ${focusedFields.lastName ? 'focus' : ''
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
              className={`input-div pass ${focusedFields.password ? 'focus' : ''
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
            <div className="sign-in-toggle">
              <p>Already have an account?</p>
              <Link to="/login">
                <span>Login</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
