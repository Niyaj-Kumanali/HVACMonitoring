import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
import './Accountinfo.css';
import { saveUser } from '../../api/userApi';
import { getCurrentUser } from '../../api/loginApi';
import Loader from '../Loader/Loader';
import { User } from '../../types/thingsboardTypes';
import CustomSnackBar from '../SnackBar/SnackBar';
import { useNavigate } from 'react-router-dom';

const Accountinfo = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loadingSave, setLoadingSave] = useState(false);
    const [loader, setLoader] = useState(true);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [snackbarType, setSnackbarType] = useState<'success' | 'error'>(
        'success'
    );
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await getCurrentUser();
                setCurrentUser(response.data);
            } catch (err: any) {
                console.error('Failed to load user', err);
                setSnackbarType('error');
                if (err.status === 401) {
                    setMessage(
                        'Session has expired. Redirecting to login page.'
                    );
                    setOpen(true);
                    setTimeout(() => {
                        navigate('/login');
                    }, 2000);
                }
            } finally {
                setLoader(false);
            }
        };
        fetchCurrentUser();
    }, [navigate]);

    const handleClick = useCallback(async () => {
        setLoadingSave(true);
        try {
            await saveUser(currentUser!, false);
            setMessage('User updated successfully');
            setSnackbarType('success');
        } catch (error: any) {
            console.log(error);
            setSnackbarType('error');
            if (error.response) {
                const { status } = error.response;
                switch (status) {
                    case 401:
                        setMessage(
                            'Session has expired. Redirecting to login page.'
                        );
                        setTimeout(() => {
                            navigate('/login');
                        }, 2000);
                        break
                    default: {
                        console.error('Error updating user', error);
                        setMessage('Error updating user');
                    }
                }
            }
            else {
                setMessage('Network error. Please check your connection.')
            }
        } finally {
            setTimeout(() => {
                setOpen(true);
                setLoadingSave(false);
            }, 700);
        }
    }, [currentUser, navigate]);

    const formatDate = useCallback((timestamp: number) => {
        return new Date(timestamp).toLocaleString();
    }, []);

    const handleInputChange = useCallback((key: keyof User, value: string) => {
        setCurrentUser((prev) => (prev ? { ...prev, [key]: value } : prev));
    }, []);

    const userFields = useMemo(
        () => [
            { label: 'Email', value: currentUser?.email ?? '', key: 'email' },
            {
                label: 'First Name',
                value: currentUser?.firstName ?? '',
                key: 'firstName',
            },
            {
                label: 'Last Name',
                value: currentUser?.lastName ?? '',
                key: 'lastName',
            },
            {
                label: 'Phone Number',
                value: currentUser?.phone ?? '',
                key: 'phone',
            },
            {
                label: 'Authority',
                value: currentUser?.authority ?? '',
                key: 'authority',
            },
        ],
        [currentUser]
    );

    return (
        <>
            <div className="menu-data">
                {loader ? (
                    <Loader />
                ) : (
                    <div className="accountinfo">
                        <header className="accountinfo-header">
                            <div className="accountinfo-email">
                                <p className="accountinfo-profile">Profile</p>
                            </div>
                            <div className="accountinfo-lastlogin">
                                <p>Last Login</p>
                                <p>
                                    {formatDate(
                                        currentUser?.additionalInfo
                                            ?.lastLoginTs || Date.now()
                                    )}
                                </p>
                            </div>
                        </header>
                        <main className="accountinfo-main">
                            {userFields.map((field, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        width: '100%',
                                        maxWidth: '100%',
                                        backgroundColor: '#ebebeb',
                                        marginBottom: '10px',
                                    }}
                                >
                                    <TextField
                                        fullWidth
                                        label={field.label}
                                        value={field.value}
                                        onChange={(e) =>
                                            handleInputChange(
                                                field.key as keyof User,
                                                e.target.value
                                            )
                                        }
                                        disabled={field.label === 'Authority'}
                                        sx={{
                                            '& .MuiInputBase-input.Mui-disabled':
                                                {
                                                    cursor:
                                                        field.label ===
                                                        'Authority'
                                                            ? 'not-allowed'
                                                            : 'auto',
                                                },
                                            '&:hover .MuiInputBase-input.Mui-disabled':
                                                {
                                                    cursor:
                                                        field.label ===
                                                        'Authority'
                                                            ? 'not-allowed'
                                                            : 'auto',
                                                },
                                        }}
                                    />
                                </Box>
                            ))}
                            <div className="accountinfo-savebtn">
                                <LoadingButton
                                    size="small"
                                    color="secondary"
                                    onClick={handleClick}
                                    loading={loadingSave}
                                    loadingPosition="start"
                                    startIcon={<SaveIcon />}
                                    variant="contained"
                                    disabled={loadingSave}
                                    sx={{ width: '150px', height: '50px' }}
                                >
                                    <span>Save</span>
                                </LoadingButton>
                            </div>
                        </main>
                    </div>
                )}
            </div>

            <CustomSnackBar
                open={open}
                setOpen={setOpen}
                snackbarType={snackbarType}
                message={message}
            />
        </>
    );
};

export default React.memo(Accountinfo);
