import React, { useState } from 'react';
import "./Addwarehouse.css";
import { FormControl, Snackbar, SnackbarCloseReason, SnackbarContent, TextField } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import ErrorIcon from '@mui/icons-material/Error';
import SaveIcon from '@mui/icons-material/Save';
import CheckIcon from '@mui/icons-material/Check';
import { mongoAPI } from '../../api/MongoAPIInstance';
import { getCurrentUser } from '../../api/loginApi';
import { useDispatch } from 'react-redux';
import { set_warehouse_count } from '../../Redux/Action/Action';

interface WarehouseDimensions {
    length: string;
    width: string;
    height: string;
}

interface WarehouseData {
    warehouse_name: string;
    latitude: string;
    longitude: string;
    warehouse_dimensions: WarehouseDimensions;
    energy_resource: string;
    cooling_units: string | null; // Set as string or null
    sensors: string | null; // Set as string or null
    userId: string,
    email: string
}

const AddWarehouse: React.FC = () => {
    const [formData, setFormData] = useState<WarehouseData>({
        warehouse_name: '',
        latitude: '',
        longitude: '',
        warehouse_dimensions: {
            length: '',
            width: '',
            height: '',
        },
        energy_resource: '',
        cooling_units: null,
        sensors: null,
        userId: '',
        email: ''
    });

    const [submitted, setSubmitted] = useState<boolean>(false);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');
    const [message, setMessage] = useState("");

    const handleReset = () => {
        setFormData({
            warehouse_name: '',
            latitude: '',
            longitude: '',
            warehouse_dimensions: {
                length: '',
                width: '',
                height: '',
            },
            energy_resource: '',
            cooling_units: null,
            sensors: null,
            userId: '',
            email: ''
        });
        setSubmitted(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Handle dimension updates
        if (name.startsWith('warehouse_dimensions.')) {
            const dimensionKey = name.split('.')[1] as keyof WarehouseDimensions;
            setFormData({
                ...formData,
                warehouse_dimensions: {
                    ...formData.warehouse_dimensions,
                    [dimensionKey]: value,
                },
            });
        } else {
            // Handle number inputs
            if (name === 'cooling_units' || name === 'sensors') {
                const numericValue = parseInt(value, 10);
            if (numericValue >= 0 || value === '') {
                setFormData({
                    ...formData,
                    [name]: value === '' ? null : value,
                });
            }
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

        const currentUser = await getCurrentUser()

        const convertedData = {
            ...formData,
            latitude: parseFloat(formData.latitude),
            longitude: parseFloat(formData.longitude),
            warehouse_dimensions: {
                length: parseFloat(formData.warehouse_dimensions.length),
                width: parseFloat(formData.warehouse_dimensions.width),
                height: parseFloat(formData.warehouse_dimensions.height),
            },
            cooling_units: Number(formData.cooling_units),
            sensors: Number(formData.sensors),
            userId: currentUser.id.id,
            email: currentUser.email
        };

        console.log(JSON.stringify(convertedData))

        try {
            const response = await mongoAPI.post("warehouse/addwarehouse", JSON.stringify(convertedData));
            console.log('Warehouse added:', response.data);

            setTimeout(() => {
                handleReset();
                setLoading(false);
                setOpen(true);
                setSnackbarType('success');
                setMessage('Warehouse Added Successfully');
                fetchAllWarehouses();
            }, 1000);

        } catch (error) {
            setTimeout(() => {
                setLoading(false);
                setOpen(true);
                setSnackbarType('error');
                setMessage('Failed to Add Warehouse');
                console.error('Error submitting form:', error);
            }, 1000);
        }
    };

    const warehousecountDispatch = useDispatch();


    const fetchAllWarehouses = async () => {
        try {
            const currentUser = await getCurrentUser()
            console.log(currentUser.id.id)

            const response = await mongoAPI.get(`/warehouse/getallwarehouse/${currentUser.id.id}`)
            warehousecountDispatch(set_warehouse_count(response.data.length))
        } catch (error) {
            console.error("Failed to fetch warehouses:", error);
        }
    };

    const handleClose = (_event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
        if (reason === 'clickaway') return;
        setOpen(false);
    };

    return (
        <div className="menu-data">
            <div className="warehouse">
                <h3>Add Warehouse</h3>
                <form className="warehouse-form" onSubmit={handleSubmit}>
                    <FormControl fullWidth margin="normal">
                        <TextField
                            label="Warehouse Name"
                            name="warehouse_name"
                            value={formData.warehouse_name}
                            onChange={handleChange}
                            disabled={submitted}
                            className='textfieldss'
                        />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <TextField
                            label="Latitude"
                            name="latitude"
                            type='number'
                            value={formData.latitude}
                            onChange={handleChange}
                            disabled={submitted}
                            className='textfieldss'
                        />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <TextField
                            label="Longitude"
                            name="longitude"
                            type="number"
                            value={formData.longitude}
                            onChange={handleChange}
                            disabled={submitted}
                            className='textfieldss'
                        />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <TextField
                            label="Length"
                            name="warehouse_dimensions.length"
                            type="number"
                            value={formData.warehouse_dimensions.length}
                            onChange={handleChange}
                            disabled={submitted}
                            className='textfieldss'
                        />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <TextField
                            label="Width"
                            name="warehouse_dimensions.width"
                            type="number"
                            value={formData.warehouse_dimensions.width}
                            onChange={handleChange}
                            disabled={submitted}
                            className='textfieldss'
                        />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <TextField
                            label="Height"
                            name="warehouse_dimensions.height"
                            type="number"
                            value={formData.warehouse_dimensions.height}
                            onChange={handleChange}
                            disabled={submitted}
                            className='textfieldss'
                        />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <TextField
                            label="Energy Resource"
                            name="energy_resource"
                            type="text"
                            value={formData.energy_resource}
                            onChange={handleChange}
                            disabled={submitted}
                            className='textfieldss'
                        />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <TextField
                            label="No Of Cooling Units"
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
                            label="No Of Sensors"
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

export default AddWarehouse;
