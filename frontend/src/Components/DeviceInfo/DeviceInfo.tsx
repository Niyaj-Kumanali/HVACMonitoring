import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    deleteDevice,
    getDeviceById,
    getDeviceCredentialsByDeviceId,
} from '../../api/deviceApi';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import ShareIcon from '@mui/icons-material/Share';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { Device } from '../../types/thingsboardTypes';
import Loader from '../Loader/Loader';
import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import './DeviceInfo.css';
import CustomSnackBar from '../SnackBar/SnackBar';

const DeviceInfo: React.FC = () => {
    const { deviceId } = useParams();
    const navigate = useNavigate();
    const [accessToken, setAccessToken] = useState<string>('');

    const isEdit = true;

    const [loadingSave, setLoadingSave] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [deviceInfo, setDeviceInfo] = useState<Device>({
        type: 'default',
    });
    // const [loading, setLoading] = useState(false);
    const [loaders, setLoaders] = useState(true);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [snackbarType, setSnackbarType] = useState<'success' | 'error'>(
        'success'
    );

    useEffect(() => {
        const fetchDeviceInfo = async () => {
            setLoadingSave(true);
            try {
                const deviceData = await getDeviceById(deviceId);
                setDeviceInfo(deviceData.data);
            } catch (error) {
                console.error('Error fetching device info:', error);
            } finally {
                setLoadingSave(false);
            }
        };

        fetchDeviceInfo();
    }, [deviceId]);




    const fetchDeviceInfo = async () => {
        try {
            const response = await getDeviceById(deviceId);
            setDeviceInfo(response.data);
            const responseForCreds = await getDeviceCredentialsByDeviceId(
                deviceId || ''
            );
            setAccessToken(responseForCreds.data.credentialsId);
        } catch (error) {
            console.error('Error fetching device info:', error);
            setMessage('Failed to fetch device information.');
            setSnackbarType('error');
            setOpen(true);
        }
    };


    const handleDeleteDevice = async () => {
        setLoadingDelete(true);

        try {
            await deleteDevice(deviceId || '');
            setTimeout(() => {
                setLoadingDelete(false);
                setOpen(true);
                setMessage('Device Deleted');
                setSnackbarType('success');

                setTimeout(() => {
                    navigate('/devices');
                }, 900);
            }, 900);
        } catch (error: any) {
            console.error('Failed to delete device', error);
            setSnackbarType('error');
            setLoadingDelete(false);
            if (error.status === 401) {
                setMessage('Session has expired navigating to login page');
                setOpen(true);
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setMessage('Failed to delete device');
                setTimeout(() => {
                    setOpen(true);
                }, 500);
            }
        }
    };


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDeviceInfo((prev) => ({ ...prev, [name]: value }));
    };

    const handleCopy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setMessage('Copied to clipboard!');
            setSnackbarType('success');
        } catch (error) {
            console.error('Failed to copy:', error);
            setMessage('Failed to copy to clipboard!');
            setSnackbarType('error');
        } finally {
            setOpen(true);
        }
    };

    useEffect(() => {
        fetchDeviceInfo();
    }, [deviceId]);

    useEffect(() => {
        fetchDeviceInfo();
        const loaderTimeout = setTimeout(() => setLoaders(false), 700);
        return () => clearTimeout(loaderTimeout);
    }, []);

    const goBack = () => {
        navigate(-1);
    };


    return (
        <>
            {loaders ? (
                <div className="menu-data">
                    <Loader />
                </div>
            ) : (
                <div className="menu-data">
                    <div className="add-device">
                        <form>
                            <div className="header-container">
                                <label className="label">
                                    <KeyboardBackspaceIcon onClick={goBack} />
                                    Device Info
                                </label>
                                <div className="buttons">
                                    <Button
                                        variant="outlined" // Use 'outlined' for a transparent background
                                        color="primary" // Sets the text and border color
                                        onClick={() => handleCopy(deviceId || '')}
                                        startIcon={<ShareIcon />}
                                        sx={{
                                            ml: 2,
                                            backgroundColor: 'transparent', // Make the background transparent
                                            border: '1px solid', // Optional: Add border to distinguish button
                                            borderColor: 'primary.main', // Border color
                                            color: 'primary.main', // Text color
                                            '&:hover': {
                                                backgroundColor: 'primary.light', // Background color on hover
                                                color: 'primary.contrastText', // Text color on hover
                                            },
                                        }}
                                    >
                                        Copy Id
                                    </Button>
                                    <Button
                                        variant="outlined" // Use 'outlined' for a transparent background
                                        color="primary" // Sets the text and border color
                                        onClick={() => handleCopy(accessToken)}
                                        startIcon={<ShareIcon />}
                                        sx={{
                                            ml: 2,
                                            backgroundColor: 'transparent', // Make the background transparent
                                            border: '1px solid', // Optional: Add border to distinguish button
                                            borderColor: 'primary.main', // Border color
                                            color: 'primary.main', // Text color
                                            '&:hover': {
                                                backgroundColor: 'primary.light', // Background color on hover
                                                color: 'primary.contrastText', // Text color on hover
                                            },
                                        }}
                                    >
                                        Copy Token
                                    </Button>
                                </div>
                            </div>
                            <Box className="text-field-box">
                                <TextField
                                    fullWidth
                                    label="Name"
                                    name="name"
                                    onChange={handleInputChange}
                                    value={deviceInfo.name || ''}
                                    required
                                    inputProps={{ readOnly: isEdit }}
                                />
                            </Box>
                            <Box className="text-field-box">
                                <TextField
                                    fullWidth
                                    label="Type"
                                    name="name"
                                    onChange={handleInputChange}
                                    value={deviceInfo.type || ''}
                                    required
                                    inputProps={{ readOnly: isEdit }}
                                />
                            </Box>
                            <Box className="text-field-box">
                                <TextField
                                    fullWidth
                                    label="Make"
                                    name="name"
                                    onChange={handleInputChange}
                                    value={deviceInfo.additionalInfo.make || ''}
                                    required
                                    inputProps={{ readOnly: isEdit }}
                                />
                            </Box>
                            <Box className="text-field-box">
                                <TextField
                                    fullWidth
                                    label="Sensitivity"
                                    name="name"
                                    onChange={handleInputChange}
                                    value={deviceInfo.additionalInfo.sensitivity || ''}
                                    required
                                    inputProps={{ readOnly: isEdit }}
                                />
                            </Box>
                            <Box className="text-field-box">
                                <TextField
                                    fullWidth
                                    label="Accuracy"
                                    name="name"
                                    onChange={handleInputChange}
                                    value={deviceInfo.additionalInfo.accuracy || ''}
                                    required
                                    inputProps={{ readOnly: isEdit }}
                                />
                            </Box>
                            <Box className="text-field-box">
                                <TextField
                                    fullWidth
                                    label="MinSamplingTime "
                                    name="name"
                                    onChange={handleInputChange}
                                    value={deviceInfo.additionalInfo.minSamplingTime || ''}
                                    required
                                    inputProps={{ readOnly: isEdit }}
                                />
                            </Box>
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr 1fr',
                                    gap: '5px',
                                }}
                            >
                                <Box className="text-field-box">
                                    <TextField
                                        fullWidth
                                        label="X "
                                        name="name"
                                        onChange={handleInputChange}
                                        value={deviceInfo.additionalInfo.placement?.x || ''}
                                        required
                                        inputProps={{ readOnly: isEdit }}
                                    />
                                </Box>
                                <Box className="text-field-box">
                                    <TextField
                                        fullWidth
                                        label="Y "
                                        name="name"
                                        onChange={handleInputChange}
                                        value={deviceInfo.additionalInfo.placement?.y || ''}
                                        required
                                        inputProps={{ readOnly: isEdit }}
                                    />
                                </Box>
                                <Box className="text-field-box">
                                    <TextField
                                        fullWidth
                                        label="Z "
                                        name="name"
                                        onChange={handleInputChange}
                                        value={deviceInfo.additionalInfo.placement?.z || ''}
                                        required
                                        inputProps={{ readOnly: isEdit }}
                                    />
                                </Box>
                            </Box>
                            <div className="accountinfo-savebtn-delete-btn">

                                <LoadingButton
                                    className="btn-save"
                                    variant="contained"
                                    onClick={() => navigate(`/editDevice/${deviceId}`)}
                                    size="small"
                                    color="primary"
                                    loadingPosition="start"
                                    startIcon={<EditIcon />}
                                >
                                    Edit
                                </LoadingButton>
                                <LoadingButton
                                    size="small"
                                    color="error"
                                    onClick={handleDeleteDevice}
                                    loading={loadingDelete}
                                    loadingPosition="start"
                                    startIcon={<DeleteIcon />}
                                    variant="contained"
                                    disabled={loadingSave}
                                    className="btn-save"
                                >
                                    <span>Delete</span>
                                </LoadingButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <CustomSnackBar
                open={open}
                setOpen={setOpen}
                snackbarType={snackbarType}
                message={message}
            />
        </>
    );
};

export default DeviceInfo;
