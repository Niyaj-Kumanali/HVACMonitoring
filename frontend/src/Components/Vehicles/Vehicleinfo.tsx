import React, { useEffect, useState } from 'react';
import "../Add-Warehouse/Addwarehouse.css";
import { Button, FormControl, Snackbar, SnackbarCloseReason, SnackbarContent, TextField } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import ErrorIcon from '@mui/icons-material/Error';
import SaveIcon from '@mui/icons-material/Save';
import CheckIcon from '@mui/icons-material/Check';
import { getVehicleByVehicleId, mongoAPI } from '../../api/MongoAPIInstance';
import { getCurrentUser } from '../../api/loginApi';
import { useNavigate, useParams } from 'react-router-dom';
import "./Vehicles.css"
import DeleteIcon from '@mui/icons-material/Delete';

// Define interfaces for vehicle data
interface VehicleDimensions {
    length: string;
    width: string;
    height: string;
}

interface DriverDetails {
    driver_name: string;
    driver_contact_no: string;
    licence_id: string;
}

interface VehicleData {
    vehicle_number: string;
    vehicle_name: string;
    vehicle_dimensions: VehicleDimensions;
    Driver_details: DriverDetails;
    cooling_units: string | null;
    sensors: string | null;
    userId: string;
    email: string;
}

const AddVehicle: React.FC = () => {
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [deleteloading, setDeleteLoading] = useState(false);
    const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');
    const [message, setMessage] = useState("");
    const { vehicleid } = useParams();
    const [isEdit, setIsEdit] = useState(true);

    const [formData, setFormData] = useState<VehicleData>({
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
        email: ''
    });

    useEffect(() => {
        if (vehicleid) {
            fetchAllVehicles();
        }
    }, [vehicleid]);

    const fetchAllVehicles = async () => {
        try {
            const response = await getVehicleByVehicleId(vehicleid);
            setFormData({
                vehicle_number: response.data.vehicle_number || '',
                vehicle_name: response.data.vehicle_name || '',
                vehicle_dimensions: {
                    length: response.data.vehicle_dimensions?.length.toString() || '',
                    width: response.data.vehicle_dimensions?.width.toString() || '',
                    height: response.data.vehicle_dimensions?.height.toString() || '',
                },
                Driver_details: {
                    driver_name: response.data.Driver_details?.driver_name || '',
                    driver_contact_no: response.data.Driver_details?.driver_contact_no.toString() || '',
                    licence_id: response.data.Driver_details?.licence_id || '',
                },
                cooling_units: response.data.cooling_units?.toString() || null,
                sensors: response.data.sensors?.toString() || null,
                userId: response.data.userId || '',
                email: response.data.email || ''
            });
        } catch (error) {
            console.error("Failed to fetch vehicle:", error);
        }
    };

    const handleReset = () => {
        setFormData({
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
            email: ''
        });
        setSubmitted(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name.startsWith('vehicle_dimensions.')) {
            const dimensionKey = name.split('.')[1] as keyof VehicleDimensions;
            setFormData(prev => ({
                ...prev,
                vehicle_dimensions: {
                    ...prev.vehicle_dimensions,
                    [dimensionKey]: value,
                },
            }));
        } else if (name.startsWith('Driver_details.')) { // Ensure consistent naming
            const driverKey = name.split('.')[1] as keyof DriverDetails;
            setFormData(prev => ({
                ...prev,
                Driver_details: {
                    ...prev.Driver_details,
                    [driverKey]: value,
                },
            }));
        } else {
            if (name === 'cooling_units' || name === 'sensors') {
                setFormData(prev => ({
                    ...prev,
                    [name]: value === '' ? null : value,
                }));
            } else {
                setFormData(prev => ({
                    ...prev,
                    [name]: value,
                }));
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const currentUser = await getCurrentUser();

            const convertedData = {
                ...formData,
                vehicle_dimensions: {
                    length: parseFloat(formData.vehicle_dimensions.length),
                    width: parseFloat(formData.vehicle_dimensions.width),
                    height: parseFloat(formData.vehicle_dimensions.height),
                },
                Driver_details: {
                    ...formData.Driver_details,
                    driver_contact_no: parseInt(formData.Driver_details.driver_contact_no, 10),
                },
                cooling_units: formData.cooling_units !== null ? Number(formData.cooling_units) : null,
                sensors: formData.sensors !== null ? Number(formData.sensors) : null,
                userId: currentUser.data.id.id,
                email: currentUser.data.email
            };

            const apiEndpoint = vehicleid ? `vehicle/updatevehicle/${vehicleid}` : "vehicle/addvehicle";
            const response = vehicleid
                ? await mongoAPI.put(apiEndpoint, JSON.stringify(convertedData))
                : await mongoAPI.post(apiEndpoint, JSON.stringify(convertedData));

            console.log('Vehicle saved:', response);

            setTimeout(() => {
                handleReset();
                setLoading(false);
                setOpen(true);
                setSnackbarType('success');
                setMessage(vehicleid ? 'Vehicle Updated Successfully' : 'Vehicle Added Successfully');
                setIsEdit(true)
                if (vehicleid) {
                    fetchAllVehicles();
                }
            }, 1000);

        } catch (error) {
            setTimeout(() => {
                setLoading(false);
                setOpen(true);
                setSnackbarType('error');
                setMessage('Failed to Save Vehicle');
                console.error('Error submitting form:', error);
            }, 1000);
        }
    };

    const navigate = useNavigate();


    const handleVehicleDelete = async () => {
        try {
            setDeleteLoading(true);
            const response = await mongoAPI.delete(`vehicle/deletevehicle/${vehicleid}`);
            console.log('Vehicle deleted:', response);

            setTimeout(() => {
                setOpen(true);
                setSnackbarType('success');
                setMessage('Vehicle Deleted Successfully');

                setTimeout(() => {
                    setDeleteLoading(false);
                    navigate("/vehicles");
                }, 500);
            }, 500);
        } catch (error) {
            setDeleteLoading(false);
            setOpen(true);
            setSnackbarType('error');
            setMessage('Failed to Delete Vehicle');
            console.error('Error deleting vehicle:', error);
        }
    };


    const handleClose = (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
        if (reason === 'clickaway') return;
        event
        setOpen(false);
    };

    return (
        <div className="menu-data">
            <div className="vehicle">
                <h3>{vehicleid ? 'Edit Vehicle' : 'Add Vehicle'}</h3>
                <form className="vehicle-form" onSubmit={handleSubmit}>

                    <FormControl fullWidth margin="normal">
                        <TextField
                            label="Vehicle Number"
                            name="vehicle_number"
                            value={formData.vehicle_number}
                            onChange={handleChange}
                            disabled={submitted}
                            className='textfieldss'
                            required
                            inputProps={{ readOnly: isEdit }}
                        />
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <TextField
                            label="Vehicle Name"
                            name="vehicle_name"
                            value={formData.vehicle_name}
                            onChange={handleChange}
                            disabled={submitted}
                            className='textfieldss'
                            required
                            inputProps={{ readOnly: isEdit }}
                        />
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <TextField
                            label="Length"
                            name="vehicle_dimensions.length"
                            type="number"
                            value={formData.vehicle_dimensions.length}
                            onChange={handleChange}
                            disabled={submitted}
                            className='textfieldss'
                            required
                            inputProps={{ readOnly: isEdit }}
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
                            className='textfieldss'
                            required
                            inputProps={{ readOnly: isEdit }}
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
                            className='textfieldss'
                            required
                            inputProps={{ readOnly: isEdit }}
                        />
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <TextField
                            label="Driver Name"
                            name="Driver_details.driver_name"
                            value={formData.Driver_details.driver_name}
                            onChange={handleChange}
                            disabled={submitted}
                            className='textfieldss'
                            required
                            inputProps={{ readOnly: isEdit }}
                        />
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <TextField
                            label="Driver Contact No"
                            name="Driver_details.driver_contact_no"
                            type="number"
                            value={formData.Driver_details.driver_contact_no}
                            onChange={handleChange}
                            disabled={submitted}
                            className='textfieldss'
                            required
                            inputProps={{ readOnly: isEdit }}
                        />
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <TextField
                            label="Licence ID"
                            name="Driver_details.licence_id"
                            value={formData.Driver_details.licence_id}
                            onChange={handleChange}
                            disabled={submitted}
                            className='textfieldss'
                            required
                            inputProps={{ readOnly: isEdit }}
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
                            className='textfieldss'
                            inputProps={{ readOnly: isEdit }}
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
                            className='textfieldss'
                            inputProps={{readOnly:isEdit}}
                        />
                    </FormControl>

                    <div className='sub-btn-flex'>
                        {
                            isEdit ? (<Button className="btn-save" variant='contained' onClick={()=>setIsEdit(false)}>Edit</Button>):(
                                <>
                                    <LoadingButton
                                        size="small"
                                        type="submit"
                                        color="secondary"
                                        loading={loading}
                                        loadingPosition="start"
                                        startIcon={<SaveIcon />}
                                        variant="contained"
                                        disabled={deleteloading}
                                        className="btn-save"
                                    >
                                        <span>Update</span>
                                    </LoadingButton>
                                
                                    <LoadingButton
                                        size="small"
                                        color="error"
                                        loading={deleteloading}
                                        loadingPosition="start"
                                        startIcon={<DeleteIcon />}
                                        variant="contained"
                                        disabled={loading}
                                        className="btn-save"
                                        onClick={handleVehicleDelete}
                                    >
                                        <span>Delete</span>
                                    </LoadingButton>
                                </>
                            )
                        }
                    </div>
                </form>
            </div>

            <Snackbar
                open={open}
                autoHideDuration={2000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                style={{ marginTop: '64px' }}
            >
                <SnackbarContent
                    style={{
                        backgroundColor: snackbarType === 'success' ? 'green' : 'red',
                        color: 'white'
                    }}
                    message={
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                            {snackbarType === 'success'
                                ? <CheckIcon style={{ marginRight: '8px' }} />
                                : <ErrorIcon style={{ marginRight: '8px' }} />}
                            {message}
                        </span>
                    }
                />
            </Snackbar>
        </div>
    );
};

export default AddVehicle;
