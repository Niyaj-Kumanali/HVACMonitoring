import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import "./Addwarehouse.css"
import { FormControl, Snackbar, SnackbarCloseReason, SnackbarContent, TextField } from '@mui/material';
import Warehouse from '../Warehouse/Warehouse';
import { useDispatch } from 'react-redux';
import { set_warehouse_count } from '../../Redux/Action/Action';
import LoadingButton from '@mui/lab/LoadingButton';
import ErrorIcon from '@mui/icons-material/Error';
import SaveIcon from '@mui/icons-material/Save';
import CheckIcon from '@mui/icons-material/Check';

interface CoolantOption {
    value: string;
    label: string;
}

interface SensorsOption {
    value: string;
    label: string;
}

interface WarehouseDimensions {
    length: string;
    width: string;
    height: string;
}

interface CoolingUnit {
    coolant: string;
    coolant_used: string;
    data: any
}

interface Sensor {
    sensor: string;
    rack_id: number;
    shelf_id: number;
    data: number
}

interface WarehouseData {
    warehouse_id: string;
    warehouse_name: string;
    latitude: string;
    longitude: string;
    warehouse_dimensions: WarehouseDimensions;
    energy_resource: string;
    cooling_units: CoolingUnit[];
    sensors: Sensor[];
}

const AddWarehouse: React.FC = () => {
    const [formData, setFormData] = useState<WarehouseData>({
        warehouse_id: '',
        warehouse_name: '',
        latitude: '',
        longitude: '',
        warehouse_dimensions: {
            length: '',
            width: '',
            height: '',
        },
        energy_resource: '',
        cooling_units: [],
        sensors: [],
    });

    const [submitted, setSubmitted] = useState<boolean>(false);
    const [coolantOptions, setCoolantOptions] = useState<CoolantOption[]>([]);
    const [sensorOptions, setSensorOptions] = useState<SensorsOption[]>([]);
    const warecountdispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');
    const [message, setMessage] = useState("");

    const fetchAvailableCoolants = async () => {
        try {
            const response = await fetch('http://3.111.205.170:2000/coolant/getavaliablecoolants');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const availableCoolants = await response.json();

            const options = availableCoolants.map((coolant: any) => ({
                value: coolant._id,
                label: coolant.coolant_id,
            }));
            setCoolantOptions(options);
        } catch (error) {
            console.error('Error fetching available coolants:', error);
        }
    };

    const fetchAvailableSensors = async () => {
        try {
            const response = await fetch('http://3.111.205.170:2000/sensor/getavaliablesensors');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const availableSensors = await response.json();

            const options = availableSensors.map((sensor: any) => ({
                value: sensor._id.toString(),
                label: sensor.sensor_id,
            }));
            setSensorOptions(options);
        } catch (error) {
            console.error('Error fetching available sensors:', error);
        }
    };

    useEffect(() => {
        if (!submitted) {
            fetchAvailableCoolants();
            fetchAvailableSensors();
        }
    }, [submitted]);

    const handleReset = () => {
        setFormData({
            warehouse_id: '',
            warehouse_name: '',
            latitude: '',
            longitude: '',
            warehouse_dimensions: {
                length: '',
                width: '',
                height: '',
            },
            energy_resource: '',
            cooling_units: [],
            sensors: [],
        });
        setSubmitted(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name.startsWith('warehouse_dimensions.') || name === 'latitude' || name === 'longitude') {
            // Validate and format number input
            const parsedValue = value.trim();
            if (parsedValue === '' || !isNaN(Number(parsedValue))) {
                if (name.startsWith('warehouse_dimensions.')) {
                    const dimensionKey = name.split('.')[1] as keyof WarehouseDimensions;
                    setFormData({
                        ...formData,
                        warehouse_dimensions: {
                            ...formData.warehouse_dimensions,
                            [dimensionKey]: parsedValue,
                        },
                    });
                } else {
                    setFormData({
                        ...formData,
                        [name]: parsedValue,
                    });
                }
            }
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };


    const handleCoolantChange = (index: number, field: keyof CoolingUnit, value: string) => {
        const updatedCoolingUnits = [...formData.cooling_units];
        updatedCoolingUnits[index] = {
            ...updatedCoolingUnits[index],
            [field]: value,
        };
        setFormData({
            ...formData,
            cooling_units: updatedCoolingUnits,
        });
    };

    const handleSensorChange = (index: number, field: keyof Sensor, value: string) => {
        const updatedSensors = [...formData.sensors];
        updatedSensors[index] = {
            ...updatedSensors[index],
            [field]: field === 'rack_id' || field === 'shelf_id' ? parseInt(value, 10) : value,
        };
        setFormData({
            ...formData,
            sensors: updatedSensors,
        });
    };

    const handleSelectChange = (selectedOptions: any, actionMeta: any) => {
        const name = actionMeta.name as keyof WarehouseData;

        if (name === 'cooling_units') {
            const formattedData = selectedOptions ? selectedOptions.map((option: { value: string; label: string }) => ({
                coolant: option.value,
                data: option.label,
                coolant_used: '',
            })) : [];
            setFormData({
                ...formData,
                [name]: formattedData,
            });
        } else if (name === 'sensors') {
            const formattedData = selectedOptions ? selectedOptions.map((option: { value: string; label: string }) => ({
                sensor: option.value,
                rack_id: 0, // Default value
                shelf_id: 0, // Default value
                data: option.label
            })) : [];
            setFormData({
                ...formData,
                [name]: formattedData,
            });
        } else {
            setFormData({
                ...formData,
                [name]: selectedOptions ? selectedOptions.map((option: { value: string }) => option.value) : [],
            });
        }
    };

    const fetchAllWarehouses = async () => {

        try {
            const response = await fetch('http://3.111.205.170:2000/warehouse/getallwarehouse');
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const data: Warehouse[] = await response.json();
            warecountdispatch(set_warehouse_count(data.length))

        } catch (error) {
            console.error("Failed to fetch warehouses:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const convertedData = {
            ...formData,
            latitude: Number(formData.latitude),
            longitude: Number(formData.longitude),
            warehouse_dimensions: {
                ...formData.warehouse_dimensions,
                length: Number(formData.warehouse_dimensions.length),
                width: Number(formData.warehouse_dimensions.width),
                height: Number(formData.warehouse_dimensions.height),
            },
        };

        try {
            const response = await fetch('http://3.111.205.170:2000/warehouse/addwarehouse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(convertedData),
            });

            if (!response.ok) {
                // Extract and throw error message from the response
                const errorResult = await response.json();
                throw new Error(errorResult.message || 'Failed to submit form');
            }

            await fetchAllWarehouses();

            setTimeout(() => {
                handleReset()
                setLoading(false);
                setOpen(true);
                setSnackbarType('success');
                setMessage('Warehouse Added Successfully');
            }, 1000);

        } catch (error) {
            setTimeout(() => {
                setLoading(false);
                setOpen(true);
                setSnackbarType('error');
                setMessage('Failed to Add Warehouse');
                console.error('Error submitting form:', error);
            }, 1000)
        }
    };


    const handleClose = (
        event: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') return;
        event
        setOpen(false);
    };



    return (
        <div className="menu-data">
            <div className="warehouse">
                <h3>Add Warehouse</h3>
                <form className="warehouse-form" onSubmit={handleSubmit}>
                    <FormControl fullWidth margin="normal">
                        <TextField
                            label="Warehouse ID"
                            name="warehouse_id"
                            value={formData.warehouse_id}
                            onChange={handleChange}
                            disabled={submitted}
                            className='textfieldss'
                        />
                    </FormControl>
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
                    <div className="form-group form-group-coolents">
                        <div>
                            <label htmlFor="cooling_units">Cooling Units:</label>
                            <Select
                                id="cooling_units"
                                name="cooling_units"
                                options={coolantOptions}
                                isMulti
                                onChange={handleSelectChange}
                                isDisabled={submitted}
                            />
                        </div>

                        {formData.cooling_units.map((coolingUnit, index) => (
                            <div key={index}>
                                <label>Coolant Used : {coolingUnit.data}</label>
                                <input
                                    type="text"
                                    value={coolingUnit.coolant_used}
                                    onChange={(e) =>
                                        handleCoolantChange(index, 'coolant_used', e.target.value)
                                    }
                                    disabled={submitted}
                                    id="cooling_units"
                                    className='coolents'
                                />
                            </div>
                        ))}
                    </div>
                    <div className="form-group form-group-coolents sensors-coolent">
                        <div>
                            <label htmlFor="sensors">Sensors:</label>
                            <Select
                                id="sensors"
                                name="sensors"
                                options={sensorOptions}
                                isMulti
                                onChange={handleSelectChange}
                                isDisabled={submitted}
                            />
                        </div>

                        {formData.sensors.map((sensor, index) => (
                            <div key={index} className="form-group-coolents">
                                <div>
                                    <label>Enter Rack ID for Sensor : {sensor.data} </label>
                                    <input
                                        type="number"
                                        value={sensor.rack_id}
                                        onChange={(e) =>
                                            handleSensorChange(index, 'rack_id', e.target.value)
                                        }
                                        disabled={submitted}
                                        id="cooling_units"
                                    />
                                </div>
                                <div>
                                    <label>Shelf ID : {sensor.data}</label>
                                    <input
                                        type="number"
                                        value={sensor.shelf_id}
                                        onChange={(e) =>
                                            handleSensorChange(index, 'shelf_id', e.target.value)
                                        }
                                        disabled={submitted}
                                        id="cooling_units"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

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
