import React, { useState } from 'react';
import "../Add-Warehouse/Addwarehouse.css";
import { FormControl, Snackbar, SnackbarCloseReason, SnackbarContent, TextField } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import ErrorIcon from '@mui/icons-material/Error';
import SaveIcon from '@mui/icons-material/Save';
import CheckIcon from '@mui/icons-material/Check';
import { mongoAPI } from '../../api/MongoAPIInstance'; 

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
    cooling_units: string | null; // Set as string or null
    sensors: string | null; // Set as string or null
}

const AddVehicle: React.FC = () => {
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
    });

    const [submitted, setSubmitted] = useState<boolean>(false);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');
    const [message, setMessage] = useState("");

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
        });
        setSubmitted(false);
    };

    

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Handle dimensions and driver details updates
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
            // Handle number inputs
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
                driver_contact_no: parseInt(formData.Driver_details.driver_contact_no, 10),
            },
            cooling_units: Number(formData.cooling_units),
            sensors: Number(formData.sensors),
        };

        console.log(convertedData)

        try {
            const response = await mongoAPI.post("vehicle/addvehicle", JSON.stringify(convertedData));
            console.log('Vehicle added:', response);

            setTimeout(() => {
                handleReset();
                setLoading(false);
                setOpen(true);
                setSnackbarType('success');
                setMessage('Vehicle Added Successfully');
            }, 1000);

        } catch (error) {
            setTimeout(() => {
                setLoading(false);
                setOpen(true);
                setSnackbarType('error');
                setMessage('Failed to Add Vehicle');
                console.error('Error submitting form:', error);
            }, 1000);
        }
    };

    const handleClose = (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
        event
        if (reason === 'clickaway') return;
        setOpen(false);
    };

    return (
        <div className="menu-data">
            <div className="vehicle">
                <h3>Add Vehicle</h3>
                <form className="vehicle-form" onSubmit={handleSubmit}>
                    <FormControl fullWidth margin="normal">
                        <TextField
                            label="Vehicle Number"
                            name="vehicle_number"
                            value={formData.vehicle_number}
                            onChange={handleChange}
                            disabled={submitted}
                            className='textfieldss'
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
                        />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <TextField
                            label="Driver Name"
                            name="driver_details.driver_name"
                            value={formData.Driver_details.driver_name}
                            onChange={handleChange}
                            disabled={submitted}
                            className='textfieldss'
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
                            className='textfieldss'
                        />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <TextField
                            label="Licence ID"
                            name="driver_details.licence_id"
                            value={formData.Driver_details.licence_id}
                            onChange={handleChange}
                            disabled={submitted}
                            className='textfieldss'
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
                        />
                    </FormControl>
                    <div className='sub-btn'>
                        <LoadingButton
                            size="small"
                            type="submit"
                            color="secondary"
                            loading={loading}
                            loadingPosition="start"
                            startIcon={<SaveIcon />}
                            variant="contained"
                            disabled={loading}
                            className="btn-save"
                        >
                            <span>Save</span>
                        </LoadingButton>
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
                            {snackbarType === 'success' ? <CheckIcon style={{ marginRight: '8px' }} /> : <ErrorIcon style={{ marginRight: '8px' }} />}
                            {message}
                        </span>
                    }
                />
            </Snackbar>
        </div>
    );
};

export default AddVehicle;
