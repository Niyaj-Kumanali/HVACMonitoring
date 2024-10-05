import React, { useEffect, useState } from 'react';
import '../Add-Warehouse/Addwarehouse.css';
import {
    Box,
    FormControl,
    TextField,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import './Addvehicle.css';
import { set_vehicle_count } from '../../Redux/Action/Action';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../Redux/Reducer';
import {
    DriverDetails,
    VehicleData,
    VehicleDimensions,
} from '../../types/thingsboardTypes';
import CustomSnackBar from '../SnackBar/SnackBar';
import { useNavigate, useParams } from 'react-router-dom';
import { getCurrentUser } from '../../api/loginApi';
import { addVehicle, getAllVehiclesByUserId, getVehicleByVehicleId } from '../../api/vehicleAPIs';
import { mongoAPI } from '../../api/MongoAPIInstance';

const AddVehicle: React.FC = () => {
    const { vehicleid } = useParams();
    const navigate = useNavigate()
    const currentUser = useSelector((state: RootState) => state.user.user);
    const defaultVehicle = {
        vehicle_number: '',
        vehicle_name: '',
        vehicle_dimensions: {
            length: '',
            width: '',
            height: '',
        },
        Driver_details: {
            driver_name: '',
            driver_contact_no: '',
            licence_id: '',
        },
        cooling_units: null,
        sensors: null,
        userId: '',
        email: '',
    };

    const [submitted, setSubmitted] = useState<boolean>(false);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [snackbarType, setSnackbarType] = useState<'success' | 'error'>(
        'success'
    );
    const [message, setMessage] = useState('');
    const vehicleCountDispatch = useDispatch();

    const [formData, setFormData] = useState<VehicleData>(defaultVehicle);

    const handleReset = () => {
        setFormData(defaultVehicle);
        setSubmitted(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name.startsWith('vehicle_dimensions.')) {
            const dimensionKey = name.split('.')[1] as keyof VehicleDimensions;
            setFormData({
                ...formData,
                vehicle_dimensions: {
                    ...formData.vehicle_dimensions,
                    [dimensionKey]: value,
                },
            });
        } else if (name.startsWith('driver_details.')) {
            const driverKey = name.split('.')[1] as keyof DriverDetails;
            setFormData({
                ...formData,
                Driver_details: {
                    ...formData.Driver_details,
                    [driverKey]: value,
                },
            });
        } else {
            if (name === 'cooling_units' || name === 'sensors') {
                setFormData({
                    ...formData,
                    [name]: value === '' ? null : value,
                });
            } else {
                setFormData({
                    ...formData,
                    [name]: value,
                });
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const convertedData = {
            ...formData,
            vehicle_dimensions: {
                length: parseFloat(formData.vehicle_dimensions.length),
                width: parseFloat(formData.vehicle_dimensions.width),
                height: parseFloat(formData.vehicle_dimensions.height),
            },
            driver_details: {
                driver_contact_no: parseInt(
                    formData.Driver_details.driver_contact_no,
                    10
                ),
            },
            cooling_units: Number(formData.cooling_units),
            sensors: Number(formData.sensors),
            userId: currentUser.id?.id,
            email: currentUser.email,
        };
        if (vehicleid) {
            try {
                await mongoAPI.put(`vehicle/updatevehicle/${vehicleid}`, convertedData);
                setTimeout(() => {
                    setLoading(false);
                    setOpen(true);
                    setSnackbarType('success');
                    setMessage('Vehicle Updated Successfully');
                    fetchAllVehicles();
                    setTimeout(() => {
                        navigate(-1)
                    }, 800)
                }, 700);

            } catch (error) {
                setTimeout(() => {
                    setLoading(false);
                    setOpen(true);
                    setSnackbarType('error');
                    setMessage('Failed TO Update Vehicle');
                }, 700);
            }
        }
        else {
            try {
                await getCurrentUser()
                await addVehicle(JSON.stringify(convertedData));

                setTimeout(() => {
                    handleReset();
                    setLoading(false);
                    setOpen(true);
                    setSnackbarType('success');
                    setMessage('Vehicle Added Successfully');
                    fetchAllVehicles();
                }, 1000);
            } catch (error: any) {
                setSnackbarType('error');

                if (error.status === 401) {
                    setMessage('Session has expired navigating to login page');
                    setOpen(true);
                    setTimeout(() => {
                        navigate('/login');
                    }, 2000);
                } else {
                    setTimeout(() => {
                        setLoading(false);
                        setOpen(true);
                        setMessage('Failed to Add Vehicle');
                    }, 1000);
                }

            }
        }
    };

    const fetchVehicleById = async () => {
        if (vehicleid) {
            try {
                const response = await getVehicleByVehicleId(vehicleid);
                setFormData({
                    ...response.data,
                });
            } catch (error) {
                console.error('Failed to fetch vehicle:', error);
            }
        }
    };

    const fetchAllVehicles = async () => {
        try {
            const response = await getAllVehiclesByUserId(
                currentUser.id?.id,
                undefined
            );
            vehicleCountDispatch(set_vehicle_count(response.data.totalElements));
        } catch (error) {
            console.error('Failed to fetch vehicles:', error);
        }
    };

    useEffect(() => {
        fetchVehicleById()
    }, [vehicleid])


    return (
        <>
            <div className="menu-data">
                <div className="form-container">
                    <h3>Add Vehicle</h3>
                    <form className="form-body" onSubmit={handleSubmit}>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                label="Vehicle Number"
                                name="vehicle_number"
                                value={formData.vehicle_number}
                                onChange={handleChange}
                                disabled={submitted}
                                className="textfieldss"
                            />
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                label="Vehicle Name"
                                name="vehicle_name"
                                value={formData.vehicle_name}
                                onChange={handleChange}
                                disabled={submitted}
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
                                    label="Length"
                                    name="vehicle_dimensions.length"
                                    type="number"
                                    value={formData.vehicle_dimensions.length}
                                    onChange={handleChange}
                                    disabled={submitted}
                                    className="textfieldss"
                                />
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    label="Width"
                                    name="vehicle_dimensions.width"
                                    type="number"
                                    value={formData.vehicle_dimensions.width}
                                    onChange={handleChange}
                                    disabled={submitted}
                                    className="textfieldss"
                                />
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    label="Height"
                                    name="vehicle_dimensions.height"
                                    type="number"
                                    value={formData.vehicle_dimensions.height}
                                    onChange={handleChange}
                                    disabled={submitted}
                                    className="textfieldss"
                                />
                            </FormControl>
                        </Box>

                        <FormControl fullWidth margin="normal">
                            <TextField
                                label="Driver Name"
                                name="driver_details.driver_name"
                                value={formData.Driver_details.driver_name}
                                onChange={handleChange}
                                disabled={submitted}
                                className="textfieldss"
                            />
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                label="Driver Contact No"
                                name="driver_details.driver_contact_no"
                                type="number"
                                value={formData.Driver_details.driver_contact_no}
                                onChange={handleChange}
                                disabled={submitted}
                                className="textfieldss"
                            />
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                label="Licence ID"
                                name="driver_details.licence_id"
                                value={formData.Driver_details.licence_id}
                                onChange={handleChange}
                                disabled={submitted}
                                className="textfieldss"
                            />
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                label="Cooling Units"
                                name="cooling_units"
                                type="number"
                                value={formData.cooling_units ?? ''}
                                onChange={handleChange}
                                disabled={submitted}
                                className="textfieldss"
                            />
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                label="Sensors"
                                name="sensors"
                                type="number"
                                value={formData.sensors ?? ''}
                                onChange={handleChange}
                                disabled={submitted}
                                className="textfieldss"
                            />
                        </FormControl>

                        <div className="btn-cont">
                            {
                                vehicleid ? (<>
                                    <LoadingButton
                                        size="small"
                                        type="submit"
                                        color="secondary"
                                        loading={loading}
                                        loadingPosition="start"
                                        startIcon={<SaveIcon />}
                                        variant="contained"
                                        disabled={loading}
                                        className="btn-all"
                                    >
                                        <span>Update</span>
                                    </LoadingButton>
                                    <LoadingButton
                                        size="small"
                                        color="primary"
                                        loadingPosition="start"
                                        startIcon={<SaveIcon />}
                                        variant="contained"
                                        disabled={loading}
                                        className="btn-all"
                                        onClick={() => navigate(`/vehicle/${vehicleid}`)}
                                    >
                                        <span>Cancel</span>
                                    </LoadingButton>
                                </>) : (
                                    <>
                                        <LoadingButton
                                            size="small"
                                            type="submit"
                                            color="secondary"
                                            loading={loading}
                                            loadingPosition="start"
                                            startIcon={<SaveIcon />}
                                            variant="contained"
                                            disabled={loading}
                                            className="btn-all"
                                        >
                                            <span>Save</span>
                                        </LoadingButton>
                                    </>
                                )
                            }
                        </div>
                    </form>
                </div>
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

export default AddVehicle;
