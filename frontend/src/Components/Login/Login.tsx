import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import waveImg from '../../assets/wave.png';
import bgImg from '../../assets/bg.svg';
import avatarImg from '../../assets/avatar.svg';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import Snackbar from '@mui/material/Snackbar';
import Slide, { SlideProps } from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { useDispatch } from 'react-redux';
import { set_Accesstoken } from '../../Redux/Action/Action';
import Loader from '../Loader/Loader';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { getResetTokenByEmail, login } from '../../api/loginApi';
import { mongoAPI } from '../../api/MongoAPIInstance';
// import PersonIcon from '@mui/icons-material/Person';
import { FormControl, IconButton, Input, InputAdornment, InputLabel } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

function SlideTransition(props: SlideProps) {
    return <Slide {...props} direction="down" />;
}

const Login: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>('');
    const [snackbarStyle, setSnackbarStyle] = useState<React.CSSProperties>({});
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [open, setOpen] = useState<boolean>(false); // State for dialog open/close
    const navigate = useNavigate();
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const dispatch = useDispatch();
    // const [usernameFocused, setUsernameFocused] = useState<boolean>(false);
    // const [passwordFocused, setPasswordFocused] = useState<boolean>(false);
    const [forgetpasswordemail, setForgetpasswordeamil] = useState("");
    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };


    const [state, setState] = useState<{
        open: boolean;
        Transition: React.ComponentType<
            TransitionProps & {
                children: React.ReactElement<any, any>;
            }
        >;
    }>({
        open: false,
        Transition: SlideTransition,
    });


    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        try {
            const token = await login(username, password);
            dispatch(set_Accesstoken(token));

            setTimeout(() => {
                setLoading(false);
                setSnackbarMessage('Login successful!');
                setSnackbarStyle({ backgroundColor: 'green' });
                setState({ open: true, Transition: SlideTransition });

                setTimeout(() => {
                    setState(prevState => ({ ...prevState, open: false }));
                    navigate('/dashboards', { state: username });
                }, 500);
            }, 800);

        } catch (error) {
            setTimeout(() => {
                setSnackbarMessage('Invalid username or password');
                setSnackbarStyle({ backgroundColor: 'red' });
                setLoading(false);
                setState({ open: true, Transition: SlideTransition });

                setTimeout(() => {
                    setState(prevState => ({ ...prevState, open: false }));
                }, 500);
            }, 700);
        }
    };


    useEffect(() => {
        if (usernameRef.current) {
            setTimeout(() => {
                usernameRef.current?.focus();
            }, 0);
        }
    }, []);

    useEffect(() => {
        const inputs = [usernameRef.current, passwordRef.current];

        const addFocusClass = (input: HTMLInputElement | null) => {
            if (input) {
                const parent = input.parentNode?.parentNode as HTMLElement;
                parent.classList.add('focus');
            }
        };

        const removeFocusClass = (input: HTMLInputElement | null) => {
            if (input) {
                const parent = input.parentNode?.parentNode as HTMLElement;
                if (input.value === '') {
                    parent.classList.remove('focus');
                }
            }
        };

        inputs.forEach((input) => {
            if (input) {
                input.addEventListener('focus', () => addFocusClass(input));
                input.addEventListener('blur', () => removeFocusClass(input));
            }
        });

        return () => {
            inputs.forEach((input) => {
                if (input) {
                    input.removeEventListener('focus', () => addFocusClass(input));
                    input.removeEventListener('blur', () => removeFocusClass(input));
                }
            });
        };
    }, []);

    const handleClose = () => {
        setState(prevState => ({ ...prevState, open: false }));
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleDialogClose = () => {
        setOpen(false);
    };

    const handleEmailsubmit = async () => {

        try {
            const response = await getResetTokenByEmail(forgetpasswordemail);

            if (response.status === 200) {
                handleDialogClose();

                let { resetToken } = response.data;
                resetToken = resetToken == null ? "": resetToken
            

                const emailPayload = {
                    email: forgetpasswordemail,
                    resetToken: resetToken,
                };

                const emailResponse = await mongoAPI.post('/mailservice/sendresetemail', emailPayload);

                if (emailResponse.status == 200) {
                    setTimeout(() => {
                        setLoading(false);
                        setSnackbarMessage('Email Sent');
                        setSnackbarStyle({ backgroundColor: 'green' });
                        setState({ open: true, Transition: SlideTransition });

                        setTimeout(() => {
                            setState(prevState => ({ ...prevState, open: false }));
                            navigate('/login')
                        }, 500);
                    }, 1000);
                } else {
                    setSnackbarMessage('Failed to send email');
                    setSnackbarStyle({ backgroundColor: 'red' });
                    setOpen(true)
                }


            } else {
                handleDialogClose();
                setSnackbarMessage('Unable to generate link');
                setSnackbarStyle({ backgroundColor: 'red' });
                setTimeout(() => {
                    setState({ open: true, Transition: SlideTransition });
                }, 500);
            }
        } catch (error) {
            console.error('Error:', error);
            handleDialogClose();
            setSnackbarMessage('An error occurred');
            setSnackbarStyle({ backgroundColor: 'red' });
            setTimeout(() => {
                setState({ open: true, Transition: SlideTransition });
            }, 500);
        }
    };


    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 500);
    }, []);

    useEffect(() => {
        if (loading) {
            const handleNavigation = (e: any) => {
                e.preventDefault();
                e.returnValue = '';
            };
            window.addEventListener('beforeunload', handleNavigation);
            return () => {
                window.removeEventListener('beforeunload', handleNavigation);
            };
        }
    }, [loading]);

    return isLoading ? (
        <div className="loading"><Loader /></div>
    ) : (
        <div className="login-page">
            <img className="wave" src={waveImg} alt="wave" />
            <div className="container">
                <div className="img">
                    <img src={bgImg} alt="background" />
                </div>
                <div className="login-content">
                    <form onSubmit={handleLogin} autoComplete="on">
                        <img src={avatarImg} alt="avatar" />
                        <h2 className="title">Welcome</h2>
                        <div className={`input-div one`}>
                            <div className="div">
                                    <TextField 
                                    id="standard-basic" 
                                    onChange={(e) => setUsername(e.target.value)} 
                                    label="Username" variant="standard" 
                                    className='saa ok'
                                    sx={{
                                        '& .MuiInput-underline:after': {
                                            borderBottomColor: '#38d39f',
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: 'var(--TextField-brandBorderFocusedColor)',
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: 'rgba(0, 0, 0, 0.5)',
                                        }
                                    }}/>
                            </div>
                        </div>
                        <div className={`input-div pass`}>
                            <div className="div">
                                    <FormControl variant="standard" className='saa'>
                                        <InputLabel 
                                            htmlFor="standard-adornment-password"
                                            sx={{
                                                color: 'black',
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
                                            onChange={(e) => setPassword(e.target.value)}
                                            sx={{
                                                '&:before': {
                                                    borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
                                                },
                                                '&:after': {
                                                    borderBottom: '2px solid #38d39f', 
                                                }
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
                                            // value={password}
                                        />
                                    </FormControl>
                            </div>
                        </div>
                        <p className="forgotPassword" onClick={handleClickOpen}>Forgot Password?</p> {/* Link to open the dialog */}
                        <LoadingButton
                            type="submit"
                            size="small"
                            loading={loading}
                            loadingPosition="start"
                            startIcon={<SaveIcon />}
                            variant="contained"
                            sx={{ width: '150px', height: '50px', marginTop: "40px" }}
                            className="btn"
                        >
                            <span>Login</span>
                        </LoadingButton>
                        <Snackbar
                            open={state.open}
                            onClose={handleClose}
                            TransitionComponent={state.Transition}
                            message={snackbarMessage}
                            key={state.Transition.name}
                            autoHideDuration={1500}
                            ContentProps={{
                                style: { ...snackbarStyle, textAlign: 'center' },
                            }}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                        />
                        <div className='sign-in-toggle'>
                            <p>Dont't have an account?</p>
                            <Link to="/signup">
                                <span>Sign Up</span>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
            <Dialog open={open} onClose={handleDialogClose}>
                <DialogTitle>Reset Password</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To reset your password, please enter your email address here. We will send
                        an email with instructions to reset your password.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="email"
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="standard"
                        value={forgetpasswordemail}
                        onChange={(e) => setForgetpasswordeamil(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Cancel</Button>
                    <Button onClick={handleEmailsubmit} color="primary">Send</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Login;
