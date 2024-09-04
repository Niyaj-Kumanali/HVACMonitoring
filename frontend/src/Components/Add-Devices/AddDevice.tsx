import "./AddDecice.css";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useState, useEffect } from "react";
import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { Device, DeviceQueryParams } from "../../types/thingsboardTypes";
import { saveDevice, getTenantDevices } from "../../api/deviceApi";
import Loader from "../Loader/Loader";
import { useDispatch } from "react-redux";
import { set_DeviceCount } from "../../Redux/Action/Action";
import { Snackbar, SnackbarCloseReason, SnackbarContent } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import ErrorIcon from '@mui/icons-material/Error';
import { getCurrentUser } from '../../api/loginApi';
import { mongoAPI } from '../../api/MongoAPIInstance';

interface Warehouse {
    warehouse_id: string;
    warehouse_name: string;
}

interface Vehicle {
    vehicle_id: string;
    vehicle_name: string;
}

const AddDevice = () => {
    const [loading, setLoading] = useState(false);
    const [deviceType, setDeviceType] = useState('default');
    const [admin, setAdmin] = useState('');
    const [location, setLocation] = useState('');
    const [action, setAction] = useState('');
    const [deviceName, setDeviceName] = useState('');
    const [label, setLabel] = useState('');
    const [warehouse, setWarehouse] = useState<Warehouse[]>([]);
    const [warehouseInfo, setWarehouseInfo] = useState('');
    const [vehicle, setVehicle] = useState<Vehicle[]>([]);
    const [vehicleInfo, setVehicleInfo] = useState('');
    const [loaders, setLoaders] = useState(true);
    const deviceCountDispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');

    useEffect(() => {
        const fetchWarehousesAndVehicles = async () => {
            try {
                const currentUser = await getCurrentUser();
                const warehouseResponse = await mongoAPI.get(`/warehouse/getallwarehouse/${currentUser.data.id.id}`);
                setWarehouse(warehouseResponse.data);

                const vehicleResponse = await mongoAPI.get(`/vehicle/getallvehicle/${currentUser.data.id.id}`);
                setVehicle(vehicleResponse.data);
            } catch (error) {
                console.error("Failed to fetch warehouses or vehicles:", error);
            }
        };

        fetchWarehousesAndVehicles();
    }, []);

    const handleDeviceTypeChange = (event: SelectChangeEvent) => {
        setDeviceType(event.target.value);
    };

    const handleAdminChange = (event: SelectChangeEvent) => {
        setAdmin(event.target.value);
    };

    const handleLocationChange = (event: SelectChangeEvent) => {
        setLocation(event.target.value);
    };

    const handleActionChange = (event: SelectChangeEvent) => {
        setAction(event.target.value);
    };

    const handleLabelChange = async (event: SelectChangeEvent) => {
        setLabel(event.target.value);
        if (event.target.value === 'warehouse') {
            setWarehouseInfo('');
        } else if (event.target.value === 'vehicle') {
            setVehicleInfo('');
        }
    };

    const handleWarehouseChange = (event: SelectChangeEvent) => {
        setWarehouseInfo(event.target.value);
    };

    const handleVehicleChange = (event: SelectChangeEvent) => {
        setVehicleInfo(event.target.value);
    };

    setTimeout(() => {
        setLoaders(false);
    }, 1000);

    const fetchDevices = async (page: number): Promise<void> => {
        try {
            const params: DeviceQueryParams = {
                pageSize: 10,
                page: page,
                type: 'default',
                textSearch: '',
                sortProperty: 'name',
                sortOrder: 'ASC',
            };

            const response = await getTenantDevices(params);
            deviceCountDispatch(set_DeviceCount(response.data.totalElements || 0));
        } catch (error) {
            console.error('Failed to fetch devices', error);
        }
    };

    const handleClick = async () => {
        setLoading(true);

        try {
            const newDevice: Device = {
                name: deviceName,
                type: deviceType,
                label: label === 'warehouse' ? warehouseInfo : vehicleInfo,
            };

            await saveDevice(newDevice);
            await fetchDevices(0);

            setTimeout(() => {
                setDeviceName('');
                setDeviceType('default');
                setAdmin('');
                setLocation('');
                setAction('');
                setLabel('');
                setLoading(false);
                setMessage("Device added successfully!");
                setSnackbarType('success');
                setOpen(true);
            }, 500);
        } catch (error) {
            console.log('Failed to create device');
            setTimeout(() => {
                setLoading(false);
                setMessage("Device Already Exist");
                setSnackbarType('error');
                setOpen(true);
            }, 500)
        }
    };

    const handleClose = (
        event: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            event
            return;
        }

        setOpen(false);
    };

    return (
        <>
            {
                loaders ? (<Loader />) : (
                    <div className="menu-data">
                        <div className="add-device">
                            <form>
                                <label htmlFor="" className="label">Device Info</label>
                                <Box className="text-field-box">
                                    <TextField
                                        fullWidth
                                        label="Name"
                                        onChange={(e) => setDeviceName(e.target.value)}
                                        value={deviceName}
                                    />
                                </Box>
                                <label htmlFor="" className="label">Label</label>
                                <FormControl className="form-control">
                                    <InputLabel id="label-label">Select Label</InputLabel>
                                    <Select
                                        labelId="label-label"
                                        id="label-select"
                                        value={label}
                                        label="Select Label"
                                        onChange={handleLabelChange}
                                        className="form-control-inner"
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value="warehouse">Warehouse</MenuItem>
                                        <MenuItem value="vehicle">Vehicle</MenuItem>
                                    </Select>
                                </FormControl>
                                {label === 'warehouse' && (
                                    <FormControl className="form-control">
                                        <InputLabel id="warehouse-label">Select Warehouse</InputLabel>
                                        <Select
                                            labelId="warehouse-label"
                                            id="warehouse-select"
                                            value={warehouseInfo}
                                            label="Select Warehouse"
                                            onChange={handleWarehouseChange}
                                            className="form-control-inner"
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            {warehouse.map((wh, index) => (
                                                <MenuItem key={index} value={wh.warehouse_id}>{wh.warehouse_name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                )}
                                {label === 'vehicle' && (
                                    <FormControl className="form-control">
                                        <InputLabel id="vehicle-label">Select Vehicle</InputLabel>
                                        <Select
                                            labelId="vehicle-label"
                                            id="vehicle-select"
                                            value={vehicleInfo}
                                            label="Select Vehicle"
                                            onChange={handleVehicleChange}
                                            className="form-control-inner"
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            {vehicle.map((veh, index) => (
                                                <MenuItem key={index} value={veh.vehicle_id}>{veh.vehicle_name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                )}
                                <label htmlFor="" className="label">Type</label>
                                <FormControl className="form-control">
                                    <InputLabel id="device-type-label">Select Type</InputLabel>
                                    <Select
                                        labelId="device-type-label"
                                        id="device-type-select"
                                        value={deviceType}
                                        label="Select Type"
                                        onChange={handleDeviceTypeChange}
                                        className="form-control-inner"
                                    >
                                        <MenuItem value="default">
                                            <em>default</em>
                                        </MenuItem>
                                        <MenuItem value="Temperature">Temperature</MenuItem>
                                    </Select>
                                </FormControl>
                                <label htmlFor="" className="label">Admin</label>
                                <FormControl className="form-control">
                                    <InputLabel id="admin-label">Select User</InputLabel>
                                    <Select
                                        labelId="admin-label"
                                        id="admin-select"
                                        value={admin}
                                        label="Select User"
                                        onChange={handleAdminChange}
                                        className="form-control-inner"
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value="Admin1">Admin1</MenuItem>
                                        <MenuItem value="Admin2">Admin2</MenuItem>
                                    </Select>
                                </FormControl>
                                <label htmlFor="" className="label">Location</label>
                                <FormControl className="form-control">
                                    <InputLabel id="location-label">Select Location</InputLabel>
                                    <Select
                                        labelId="location-label"
                                        id="location-select"
                                        value={location}
                                        label="Select Location"
                                        onChange={handleLocationChange}
                                        className="form-control-inner"
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value="Location1">Location1</MenuItem>
                                        <MenuItem value="Location2">Location2</MenuItem>
                                    </Select>
                                </FormControl>
                                <label htmlFor="" className="label">Action</label>
                                <FormControl className="form-control">
                                    <InputLabel id="action-label">Select Action</InputLabel>
                                    <Select
                                        labelId="action-label"
                                        id="action-select"
                                        value={action}
                                        label="Select Action"
                                        onChange={handleActionChange}
                                        className="form-control-inner"
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value="Action1">Action1</MenuItem>
                                        <MenuItem value="Action2">Action2</MenuItem>
                                    </Select>
                                </FormControl>
                                <div className="accountinfo-savebtn">
                                    <LoadingButton
                                        size="small"
                                        color="secondary"
                                        onClick={handleClick}
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
                )
            }
        </>
    );
};

export default AddDevice;
