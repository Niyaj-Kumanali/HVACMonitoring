import React, { useState } from 'react';
import { FormControl, Snackbar, SnackbarCloseReason, SnackbarContent, TextField } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import ErrorIcon from '@mui/icons-material/Error';
import SaveIcon from '@mui/icons-material/Save';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import { mongoAPI } from '../../api/MongoAPIInstance';
import { getCurrentUser } from '../../api/loginApi';
import { useDispatch } from 'react-redux';
import { set_warehouse_count } from '../../Redux/Action/Action';
import { useLocation, useNavigate } from 'react-router-dom';

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
    cooling_units: string | null;
    sensors: string | null;
    userId: string;
    email: string;
}

const Warehouse: React.FC = () => {

    const location = useLocation();
    const warehouse = location.state;

    const [formData, setFormData] = useState<WarehouseData>({
        warehouse_name: warehouse.warehouse_name,
        latitude: warehouse.latitude,
        longitude: warehouse.longitude,
        warehouse_dimensions: { length: warehouse.warehouse_dimensions.length, width: warehouse.warehouse_dimensions.width, height: warehouse.warehouse_dimensions.height },
        energy_resource: warehouse.energy_resource,
        cooling_units: warehouse.cooling_units,
        sensors: warehouse.sensors,
        userId: warehouse.userId,
        email: warehouse.email
    });

    const [submitted, setSubmitted] = useState<boolean>(false);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingg, setLoadingg] = useState(false);
    const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');
    const [message, setMessage] = useState("");

    
    const navigate = useNavigate();
    const warehousecountDispatch = useDispatch();

    const handleDeleteWarehouse = async () => {
        setLoadingg(true);

        setTimeout(async () => {
            try {
                await mongoAPI.delete(`/warehouse/deletewarehouse/${warehouse.warehouse_id}`);
                fetchAllWarehouses();

                setOpen(true);
                setSnackbarType('success');
                setMessage('Warehouse Deleted Successfully');

                setTimeout(() => {
                    setLoadingg(false);
                    navigate("/warehouses");
                }, 500);
            } catch (error) {
                console.error("Error deleting warehouse:", error);
                setOpen(true);
                setSnackbarType('error');
                setMessage('Failed to Delete Warehouse');

                setTimeout(() => {
                    setLoadingg(false);
                    navigate("/warehouses");
                }, 1000);
            }
        }, 1000); 
    };



    const handleReset = () => {
        setFormData({
            warehouse_name: formData.warehouse_name,
            latitude: formData.latitude,
            longitude: formData.longitude,
            warehouse_dimensions: { length: formData.warehouse_dimensions.length, width: formData.warehouse_dimensions.width, height: formData.warehouse_dimensions.height },
            energy_resource: formData.energy_resource,
            cooling_units: formData.cooling_units,
            sensors: formData.sensors,
            userId: formData.userId,
            email: formData.email
        });
        setSubmitted(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name.startsWith('warehouse_dimensions.')) {
            const dimensionKey = name.split('.')[1] as keyof WarehouseDimensions;
            setFormData((prev) => ({
                ...prev,
                warehouse_dimensions: {
                    ...prev.warehouse_dimensions,
                    [dimensionKey]: value,
                },
            }));
        } else if (name === 'cooling_units' || name === 'sensors') {
            setFormData((prev) => ({
                ...prev,
                [name]: value === '' ? null : value,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        console.log(formData)
        e.preventDefault();

        setLoading(true);


        try {

            const currentUser = await getCurrentUser();
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
                userId: currentUser.data.id.id,
                email: currentUser.data.email,
            };

            await mongoAPI.put(`warehouse/updatewarehouse/${warehouse.warehouse_id}`, JSON.stringify(convertedData));

            setTimeout(() => {
                setLoading(false);
                setOpen(true);
                setSnackbarType('success');
                setMessage('Warehouse Updated Successfully');
                fetchAllWarehouses();
                handleReset();
            }, 500);
        } catch (error) {
            setTimeout(() => {
                setLoading(false);
                setOpen(true);
                setSnackbarType('error');
                setMessage('Failed to Update Warehouse');
                console.error("Error submitting form:", error);
            }, 500);
        }
    };

    const fetchAllWarehouses = async () => {
        try {
            const currentUser = await getCurrentUser();

            const response = await mongoAPI.get(`/warehouse/getallwarehouse/${currentUser.data.id.id}`);
            if (response.data.length === 0) {
                warehousecountDispatch(set_warehouse_count(0));
            } else {
                warehousecountDispatch(set_warehouse_count(response.data.length));
            }
        } catch (error) {
            console.error("Failed to fetch warehouses:", error);
            warehousecountDispatch(set_warehouse_count(0));
        }
    };

    const handleClose = (_event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
        if (reason === 'clickaway') return;
        setOpen(false);
    };

    return (
        <div className="menu-data">
            <div className="warehouse">
                <h3>Warehouse: {warehouse.warehouse_name}</h3>
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
                            type="number"
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
                    <div className='del-btn-warehouse'>
                        <LoadingButton
                            size="small"
                            type="submit"
                            color="secondary"
                            loading={loading}
                            loadingPosition="start"
                            startIcon={<SaveIcon />}
                            variant="contained"
                            disabled={loadingg}
                            className="btn-save"
                        >
                            <span>Update</span>
                        </LoadingButton>
                        <LoadingButton
                            size="small"
                            color="error"
                            loading={loadingg}
                            loadingPosition="start"
                            startIcon={<DeleteIcon />}
                            variant="contained"
                            disabled={loading}
                            className="btn-save"
                            onClick={handleDeleteWarehouse}
                        >
                            <span>Delete</span>
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
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                    }}
                    message={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px'}}>
                            {snackbarType === 'success' ? <CheckIcon /> : <ErrorIcon />}
                            <span>{message}</span>
                        </div>
                    }
                />
            </Snackbar>
        </div>
    );
};

export default Warehouse;
