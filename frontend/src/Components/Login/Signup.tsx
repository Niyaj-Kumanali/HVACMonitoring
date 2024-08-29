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
import thingsboardAPI from '../../api/thingsboardAPI';
import Loader from '../Loader/Loader';

function SlideTransition(props: SlideProps) {
    return <Slide {...props} direction="down" />;
}

const Login: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>('');
    const [snackbarStyle, setSnackbarStyle] = useState<React.CSSProperties>({});
    const [isLoading, setIsLoading] = useState<boolean>(true); // Added loading state
    const navigate = useNavigate();
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const dispatch = useDispatch();
    const [usernameFocused, setUsernameFocused] = useState<boolean>(false);
    const [passwordFocused, setPasswordFocused] = useState<boolean>(false);

    const handleFocus = (setter: React.Dispatch<React.SetStateAction<boolean>>) => () => {
        setter(true);
    };

    // Handler for blur event
    const handleBlur = (setter: React.Dispatch<React.SetStateAction<boolean>>) => (e: any) => {
        if (e.target.value === '') {
            setter(false);
        }
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

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        setLoading(true);

        try {
            await login(username, password);

            // Set success message and show it after the button finishes loading
            setTimeout(() => {
                setLoading(false);
                setSnackbarMessage('Login successful!');
                setSnackbarStyle({ backgroundColor: 'green' });
                setState({ open: true, Transition: SlideTransition });

                // Hide the success message after 1 second
                setTimeout(() => {
                    setState(prevState => ({ ...prevState, open: false }));
                    navigate('/dashboards', { state: username });
                }, 500);
            }, 1000);

        } catch (error) {
            setSnackbarMessage('Invalid username or password');
            setSnackbarStyle({ backgroundColor: 'red' });
            setLoading(false);
            setState({ open: true, Transition: SlideTransition });

            // Hide the error message after 1 second
            setTimeout(() => {
                setState(prevState => ({ ...prevState, open: false }));
            }, 1000); // 1 second delay before hiding
        }
    };


    // Focus username input on mount
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
                        <h2 className="title">Sign Up</h2>
                        <div className={`input-div one ${usernameFocused ? 'focus' : ''}`}>
                            <div className="i">
                                <i className="fas fa-user"></i>
                            </div>
                            <div className="div">
                                <h5>Username</h5>
                                <input
                                    type="text"
                                    className="input"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    onFocus={handleFocus(() => setUsernameFocused(true))}
                                    onBlur={handleBlur(() => setUsernameFocused(false))}
                                    autoComplete="username"
                                />
                            </div>
                        </div>
                        <div className={`input-div pass ${passwordFocused ? 'focus' : ''}`}>
                            <div className="i">
                                <i className="fas fa-lock"></i>
                            </div>
                            <div className="div">
                                <h5>Password</h5>
                                <input
                                    type="password"
                                    className="input"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onFocus={handleFocus(() => setPasswordFocused(true))}
                                    onBlur={handleBlur(() => setPasswordFocused(false))}
                                    autoComplete="current-password"
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
                            <p>Already have an account ? </p>
                            <Link to={"/login"}>Login In</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
