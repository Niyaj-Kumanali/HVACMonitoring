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
import { Tenant, User } from '../../types/thingsboardTypes';
import { CreateSignUpUser } from '../../api/signupAPIs';
import { getActivationLink } from '../../api/userApi';
import axios from 'axios';

function SlideTransition(props: SlideProps) {
    return <Slide {...props} direction="down" />;
}

const Signup: React.FC = () => {
    const [orgName, setOrgName] = useState('Tenant');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>('');
    const [snackbarStyle, setSnackbarStyle] = useState<React.CSSProperties>({});
    const [isLoading, setIsLoading] = useState<boolean>(true); // Added loading state
    const navigate = useNavigate();
    const firstNameRef = useRef<HTMLInputElement>(null);
    const lastNameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const dispatch = useDispatch();
    const [firstNameFocused, setfirstNameFocused] = useState<boolean>(false);
    const [lastNameFocused, setlastNameFocused] = useState<boolean>(false);
    const [emailFocused, setemailFocused] = useState<boolean>(false);
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

    // const func = async (link: string, password: string) => {
    //     console.log(link, password)
    //     try {

    //         // curl -X POST link -d "password=password>"
    //         const response = await thingsboardAPI.post(link, {
    //             password: password
    //         });
    //         return response.data; // or handle the response as needed
    //     } catch (error) {
    //         console.error("Error occurred during API call:", error);
    //         throw error; // or handle the error as needed
    //     }
    // }

    // Function to set the password using the activation link and token
    const setUserPassword = async (activateToken: string, password: string) => {
        const response = await axios.post('http://3.111.205.170:8085/login/createPassword', {
            activateToken,
            password,
            confirmPassword: password
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        return response;

    };

    // const login = async (username: string, password: string): Promise<string> => {
    //     try {
    //         const response = await thingsboardAPI.post<{ token: string }>(
    //             '/auth/login',
    //             { username, password }
    //         );
    //         const token = response.data.token;
    //         localStorage.setItem('token', token);
    //         console.log(response.data)
    //         dispatch(set_Accesstoken(token));
    //         return token;
    //     } catch (error) {
    //         console.error('Login failed', error);
    //         throw error;
    //     }
    // };


    const handleSignUp = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const userBody: User = {
                email: email,
                authority: 'TENANT_ADMIN',
                firstName: firstName,
                lastName: lastName,
                password: password,
                phone: '',
                additionalInfo: {},
            };

            const tenant: Tenant = {
                title: orgName,
            };

            // Create the user
            let responseActivationLink = {}
            try{
                const createdUser = await CreateSignUpUser(tenant, userBody);
                responseActivationLink = await getActivationLink(createdUser.data.id?.id);
            }
            catch(error ){
                console.log("Error creating user", error)
                return
            }


            const activateToken = responseActivationLink?.data.split("=")[1];
            console.log("Activation Token:", activateToken);

            // Set the user password
            const res = await setUserPassword(activateToken, password);
            console.log("Set Password Response:", res);

            if (res.status === 200) {
                // Uncomment to navigate to login page
                // navigate('/login');
                console.log("Password set successfully, navigate to login.");
            } else {
                console.error('Activation failed:', res);
            }

            setSuccessMessage(
                'Sign-up successful! Please check your email to activate your account.'
            );
            setFirstName('');
            setLastName('');
            setEmail('');
            setPassword('');
        } catch (error) {
            throw error
        } finally {
            setIsLoading(false);
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
                    <form onSubmit={handleSignUp} autoComplete="on">
                        <img src={avatarImg} alt="avatar" />
                        <h2 className="title">Sign Up</h2>

                        <div className={`input-div one ${firstNameFocused ? 'focus' : ''}`}>
                            <div className="i">
                                <i className="fas fa-user"></i>
                            </div>
                            <div className="div">
                                <h5>FirstName</h5>
                                <input
                                    type="text"
                                    className="input"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    onFocus={handleFocus(() => setfirstNameFocused(true))}
                                    onBlur={handleBlur(() => setfirstNameFocused(false))}
                                    autoComplete="firstName"
                                />
                            </div>
                        </div>
                        <div className={`input-div one ${lastNameFocused ? 'focus' : ''}`}>
                            <div className="i">
                                <i className="fas fa-user"></i>
                            </div>
                            <div className="div">
                                <h5>LastName</h5>
                                <input
                                    type="text"
                                    className="input"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    onFocus={handleFocus(() => setlastNameFocused(true))}
                                    onBlur={handleBlur(() => setlastNameFocused(false))}
                                    autoComplete="lastName"
                                />
                            </div>
                        </div>

                        <div className={`input-div one ${emailFocused ? 'focus' : ''}`}>
                            <div className="i">
                                <i className="fas fa-user"></i>
                            </div>
                            <div className="div">
                                <h5>Email</h5>
                                <input
                                    type="email"
                                    className="input"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onFocus={handleFocus(() => setemailFocused(true))}
                                    onBlur={handleBlur(() => setemailFocused(false))}
                                    autoComplete="email"
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
                            <span>Sign up</span>
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

export default Signup;
