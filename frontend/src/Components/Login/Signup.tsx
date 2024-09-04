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
    const [isLoading, setIsLoading] = useState<boolean>(true); 
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [firstNameFocused, setFirstNameFocused] = useState<boolean>(false);
    const [lastNameFocused, setLastNameFocused] = useState<boolean>(false);
    const [emailFocused, setEmailFocused] = useState<boolean>(false);
    const [passwordFocused, setPasswordFocused] = useState<boolean>(false);

    const handleFocus = (setter: React.Dispatch<React.SetStateAction<boolean>>) => () => {
        setter(true);
    };

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

            let responseActivationLink;
            try {
                const createdUser = await CreateSignUpUser(tenant, userBody);
                responseActivationLink = await getActivationLink(createdUser.data.id?.id);
            } catch (error) {
                console.error("Error creating user:", error);
                setErrorMessage("Failed to create user. Please try again.");
                return;
            }

            const activateToken = responseActivationLink?.data.split("=")[1];
            const res = await setUserPassword(activateToken, password);

            if (res.status === 200) {
                navigate('/login');
            } else {
                setErrorMessage('Activation failed. Please check your email for the activation link.');
            }

            setSuccessMessage('Sign-up successful! Please check your email to activate your account.');
            setFirstName('');
            setLastName('');
            setEmail('');
            setPassword('');
        } catch (error) {
            setErrorMessage('An error occurred during sign-up. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 500);
    }, []);

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
                                    onFocus={handleFocus(setFirstNameFocused)}
                                    onBlur={handleBlur(setFirstNameFocused)}
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
                                    onFocus={handleFocus(setLastNameFocused)}
                                    onBlur={handleBlur(setLastNameFocused)}
                                    autoComplete="lastName"
                                />
                            </div>
                        </div>

                        <div className={`input-div one ${emailFocused ? 'focus' : ''}`}>
                            <div className="i">
                                <i className="fas fa-envelope"></i>
                            </div>
                            <div className="div">
                                <h5>Email</h5>
                                <input
                                    type="email"
                                    className="input"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onFocus={handleFocus(setEmailFocused)}
                                    onBlur={handleBlur(setEmailFocused)}
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
                                    onFocus={handleFocus(setPasswordFocused)}
                                    onBlur={handleBlur(setPasswordFocused)}
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
                            onClose={() => setState(prevState => ({ ...prevState, open: false }))}
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
                            <p>Already have an account? </p>
                            <Link to={"/login"}>Log In</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
