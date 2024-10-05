import './AddDevice.css';
import { useEffect, useState, useCallback } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
import { Device, DeviceQueryParams } from '../../types/thingsboardTypes';
import { saveDevice, getTenantDevices, getDeviceById } from '../../api/deviceApi';
import Loader from '../Loader/Loader';
import { useDispatch } from 'react-redux';
import { set_DeviceCount } from '../../Redux/Action/Action';
import CustomSnackBar from '../SnackBar/SnackBar';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, FormControl, TextField } from '@mui/material';

const AddDevice = () => {
    const { deviceid } = useParams<{ deviceid: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [loaders, setLoaders] = useState(true);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');

    const [deviceInfo, setDeviceInfo] = useState<Device>({
        type: 'default',
        additionalInfo: {},
    });

    const fetchDevice = useCallback(async () => {
        if (!deviceid) return;
        try {
            const response = await getDeviceById(deviceid);
            setDeviceInfo(response.data);
        } catch (error) {
            console.error('Error fetching device info:', error);
            setMessage('Failed to fetch device information.');
            setSnackbarType('error');
            setOpen(true);
        } finally {
            setLoaders(false);
        }
    }, [deviceid]);

    useEffect(() => {
        if (deviceid) {
            fetchDevice();
        } else {
            setLoaders(false);
        }
    }, [deviceid, fetchDevice]);

    const fetchDevices = useCallback(async (page: number = 0): Promise<void> => {
        try {
            const params: DeviceQueryParams = {
                pageSize: 10,
                page,
            };
            const response = await getTenantDevices(params);
            dispatch(set_DeviceCount(response.data.totalElements || 0));
        } catch (error) {
            console.error('Failed to fetch devices', error);
            setMessage('Failed to fetch device count.');
            setSnackbarType('error');
            setOpen(true);
        }
    }, [dispatch]);

    useEffect(() => {
        fetchDevices();
    }, [fetchDevices]);

    // Handle input changes
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        field: keyof Device | string,
        nestedField?: keyof Device['additionalInfo'] | keyof Device['additionalInfo']['placement']
    ) => {
        const value = e.target.value;
        setDeviceInfo(prev => {
            if (nestedField) {
                if (field === 'additionalInfo') {
                    if (nestedField === 'placement') {
                        return {
                            ...prev,
                            additionalInfo: {
                                ...prev.additionalInfo,
                                placement: {
                                    ...prev.additionalInfo?.placement,
                                    ...(value !== '' ? { [nestedField]: Number(value) } : { [nestedField]: undefined }),
                                },
                            },
                        };
                    }
                    return {
                        ...prev,
                        additionalInfo: {
                            ...prev.additionalInfo,
                            [nestedField]: value,
                        },
                    };
                }
                return prev;
            }
            return {
                ...prev,
                [field]: value,
            };
        });
    };

    const handleSubmit = useCallback(async () => {
        setLoading(true);

        if (!deviceInfo.name || !deviceInfo.type) {
            setMessage('Please fill in all required fields.');
            setSnackbarType('error');
            setOpen(true);
            setLoading(false);
            return;
        }

        try {
            await saveDevice(deviceInfo);
            await fetchDevices();

            setMessage(deviceid ? 'Device updated successfully!' : 'Device added successfully!');
            setSnackbarType('success');
            setOpen(true);

            if (!deviceid) {
                setDeviceInfo({
                    type: 'default',
                    additionalInfo: {},
                });
            }
        } catch (error: any) {
            console.error('Error saving device:', error);
            setSnackbarType('error');
            if (error?.status === 400) {
                setMessage('Device already exists.');
            } else if (error?.status === 401) {
                setMessage('Session expired. Redirecting to login...');
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setMessage('Error adding/updating device.');
            }
            setOpen(true);
        } finally {
            setLoading(false);
            if (deviceid) {
                setTimeout(() => navigate(`/device/${deviceid}`), 600);
            }
        }
    }, [deviceInfo, deviceid, fetchDevices, navigate]);

    return (
        <>
            {loaders ? (
                <div className="menu-data">
                    <Loader />
                </div>
            ) : (
                <div className="menu-data">
                        <div className="form-container">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSubmit();
                            }}
                            className='form-body'
                        >
                            <h3 className="label">
                                {deviceid ? 'Update Device' : 'Add Device'}
                            </h3>
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    id="device-name"
                                    fullWidth
                                    label="Name"
                                    onChange={(e) => handleInputChange(e, 'name')}
                                    value={deviceInfo.name || ''}
                                    required
                                    className="textfieldss"
                                />
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    id="device-type"
                                    fullWidth
                                    label="Select Type"
                                    name="type"
                                    onChange={(e) => handleInputChange(e, 'type')}
                                    value={deviceInfo.type || ''}
                                    required
                                    className="textfieldss"
                                />
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    id="device-make"
                                    fullWidth
                                    label="Make"
                                    onChange={(e) => handleInputChange(e, 'additionalInfo', 'make')}
                                    value={deviceInfo.additionalInfo?.make || ''}
                                    required
                                    className="textfieldss"
                                />
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    id="device-sensitivity"
                                    fullWidth
                                    label="Sensitivity"
                                    onChange={(e) => handleInputChange(e, 'additionalInfo', 'sensitivity')}
                                    value={deviceInfo.additionalInfo?.sensitivity || ''}
                                    required
                                    className="textfieldss"
                                />
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    id="device-accuracy"
                                    fullWidth
                                    label="Accuracy"
                                    onChange={(e) => handleInputChange(e, 'additionalInfo', 'accuracy')}
                                    value={deviceInfo.additionalInfo?.accuracy || ''}
                                    required
                                    className="textfieldss"
                                />
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    id="device-min-sampling-time"
                                    fullWidth
                                    type="number"
                                    label="Min. Sampling Time (In seconds)"
                                    onChange={(e) => handleInputChange(e, 'additionalInfo', 'minSamplingTime')}
                                    value={deviceInfo.additionalInfo?.minSamplingTime || ''}
                                    required
                                    className="textfieldss"
                                />
                            </FormControl>
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr 1fr',
                                    gap: '5px',
                                }}
                            >
                                <FormControl fullWidth margin="normal">
                                    <TextField
                                        fullWidth
                                        className="textfieldss"
                                        label="x"
                                        name="x"
                                        type="number"
                                        onChange={(e) =>
                                            setDeviceInfo((prev) => ({
                                                ...prev,
                                                additionalInfo: {
                                                    ...prev.additionalInfo,
                                                    placement: {
                                                        ...prev.additionalInfo
                                                            .placement,
                                                        x: e.target.value,
                                                    },
                                                },
                                            }))
                                        }
                                        value={
                                            deviceInfo?.additionalInfo
                                                ?.placement?.x
                                        }
                                        required
                                    />
                                </FormControl>
                                <FormControl fullWidth margin="normal">
                                    <TextField
                                        fullWidth
                                        className="textfieldss"
                                        label="y"
                                        type="number"
                                        onChange={(e) =>
                                            setDeviceInfo((prev) => ({
                                                ...prev,
                                                additionalInfo: {
                                                    ...prev.additionalInfo,
                                                    placement: {
                                                        ...prev.additionalInfo
                                                            .placement,
                                                        y: e.target.value,
                                                    },
                                                },
                                            }))
                                        }
                                        value={
                                            deviceInfo?.additionalInfo
                                                ?.placement?.y
                                        }
                                        required
                                    />
                                </FormControl>
                                <FormControl fullWidth margin="normal">
                                    <TextField
                                        fullWidth
                                        className="textfieldss"
                                        label="z"
                                        type="number"
                                        onChange={(e) =>
                                            setDeviceInfo((prev) => ({
                                                ...prev,
                                                additionalInfo: {
                                                    ...prev.additionalInfo,
                                                    placement: {
                                                        ...prev.additionalInfo
                                                            .placement,
                                                        z: e.target.value,
                                                    },
                                                },
                                            }))
                                        }
                                        value={
                                            deviceInfo?.additionalInfo
                                                ?.placement?.z
                                        }
                                        required
                                    />
                                </FormControl>
                            </Box>
                            <div className="btn-cont">
                                <LoadingButton
                                    size="small"
                                    color="secondary"
                                    type="submit"
                                    loading={loading}
                                    loadingPosition="start"
                                    startIcon={<SaveIcon />}
                                    variant="contained"
                                    disabled={loading}
                                    className="btn-all"
                                >
                                    <span>{deviceid ? 'Update' : 'Save'}</span>
                                </LoadingButton>
                                {deviceid && (
                                    <LoadingButton
                                        size="small"
                                        color="primary"
                                        onClick={() => navigate(`/device/${deviceid}`)}
                                        disabled={loading}
                                        loadingPosition="start"
                                        startIcon={<SaveIcon />}
                                        variant="contained"
                                        className="btn-save"
                                    >
                                        <span>Cancel</span>
                                    </LoadingButton>
                                )}
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

export default AddDevice;
