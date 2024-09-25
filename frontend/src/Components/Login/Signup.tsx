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
import { FormControl, IconButton, Input, InputAdornment, InputLabel, TextField } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
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
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleInputChange =
    (field: keyof typeof formData) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [field]: e.target.value });
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
            <form onSubmit={handleSignUp} autoComplete="off">
            <img src={avatarImg} alt="avatar" />
            <h2 className="title">Sign Up</h2>

            <div
              className={`input-div one 
                }`}
            >
              <div className="div">
                  <TextField
                    id="standard-basic"
                    onChange={handleInputChange('firstName')}
                    label="First Name" variant="standard"
                    autoComplete="off"
                    className='saa ok'
                    value={formData.firstName}
                    sx={{
                      '& .MuiInput-underline:after': {
                        borderBottomColor: '#38d39f',
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(0, 0, 0, 0.7)',
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: 'rgba(0, 0, 0, 0.5)',
                      }
                    }} />
              </div>
            </div>

            <div
              className={`input-div one`}
            >
              <div className="div">
                  <TextField
                    id="standard-basic"
                    onChange={handleInputChange('lastName')}
                    label="Last Name" variant="standard"
                    className='saa ok'
                    autoComplete="off"
                    value={formData.lastName}
                    sx={{
                      '& .MuiInput-underline:after': {
                        borderBottomColor: '#38d39f',
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(0, 0, 0, 0.7)',
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: 'rgba(0, 0, 0, 0.5)',
                      }
                    }} />
              </div>
            </div>

            <div
              className={`input-div one`}
            >
              <div className="div">
                  <TextField
                    id="unique-id-email"
                    onChange={handleInputChange('email')}
                    label="Email" variant="standard"
                    autoComplete='new-email'
                    className='saa ok'
                    value={formData.email}
                    sx={{
                      '& .MuiInput-underline:after': {
                        borderBottomColor: '#38d39f',
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(0, 0, 0, 0.7)',
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: 'rgba(0, 0, 0, 0.5)',
                      }
                    }} />
              </div>
            </div>

            <div
              className={`input-div pass `}
            >
              <div className="div">
                  <FormControl variant="standard" className='saa'>
                    <InputLabel 
                      htmlFor="standard-adornment-password"
                      sx={{
                        color: 'rgba(0, 0, 0, 0.7)',
                        '&.Mui-focused': {
                          color: 'rgba(0, 0, 0, 0.42)',
                        },
                      }}
                      >
                        Password
                      </InputLabel>
                    <Input
                      id="standard-adornment-password"
                      type={showPassword ? 'text' : 'password'}
                      onChange={handleInputChange('password')}
                      autoComplete="new-password"
                      sx={{
                        '&:before': {
                          borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
                        },
                        '&:after': {
                          borderBottom: '2px solid #38d39f',
                        },
                      }}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            onMouseUp={handleMouseUpPassword}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                    value={formData.password}
                    />
                  </FormControl>
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
