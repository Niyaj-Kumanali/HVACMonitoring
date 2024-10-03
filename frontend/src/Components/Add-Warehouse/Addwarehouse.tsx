import React, { useEffect, useState } from 'react';
import './Addwarehouse.css';
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Switch,
    TextField,
    FormControlLabel,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';

import { useDispatch, useSelector } from 'react-redux';
import { set_warehouse_count } from '../../Redux/Action/Action';
import { RootState } from '../../Redux/Reducer';
import {
    Device,
    dgset,
    grid,
    RoomType,
    WarehouseData,
    WarehouseDimensions,
} from '../../types/thingsboardTypes';
import CustomSnackBar from '../SnackBar/SnackBar';
import { getCurrentUser } from '../../api/loginApi';
import { useNavigate, useParams } from 'react-router-dom';
import {
    addWarehouse,
    getAllWarehouseByUserId,
    getWarehouseByWarehouseId,
    updateWarehouseByWarehouseId,
} from '../../api/warehouseAPIs';
import { AddWarehouseIdToRooms, getAllRooms } from '../../api/roomAPIs';
import { AddWarehouseIdToDGSet, getAllDGSET } from '../../api/dgsetAPIs';
import { AddWarehouseIdToGrid, getAllGRID } from '../../api/gridAPIs';
import { getTenantDeviceInfos, updateDeviceLabels } from '../../api/deviceApi';

const defaultWarehouse = {
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
    rooms: [],
    dgset: [],
    grid: [],
    devices: [],
    powerSource: false,
    userId: '',
    email: '',
};

const AddWarehouse: React.FC = () => {
    const { warehouseid } = useParams();

    const navigate = useNavigate();
    const [formData, setFormData] = useState<WarehouseData>(defaultWarehouse);

    const getAllRoomsfunc = async () => {
        try {
            const response = await getAllRooms();
            setAllRooms(response.data);
        } catch (error) {
            console.error('Error fetching rooms:', error);
        }
    };

    const getAllDGsetsfunc = async () => {
        try {
            const response = await getAllDGSET();
            setAllDGsets(response.data);
        } catch (error) {
            console.error('Error fetching DGsets:', error);
        }
    };

    const getAllGridsfunc = async () => {
        try {
            const response = await getAllGRID();
            setAllGrids(response.data);
            // console.log(response);
        } catch (error) {
            console.error('Error fetching Grids:', error);
        }
    };

    const fetchWarehouseById = async () => {
        if (warehouseid) {
            try {
                const response = await getWarehouseByWarehouseId(warehouseid);
                setFormData(response.data);
            } catch (err) {
                console.error('Failed to fetch warehouse', err);
            }
        }
    };

    const fetchDevices = async () => {
        try {
            const params = {
                pageSize: 1000,
                page: 0,
                sortProperty: 'name',
                sortOrder: 'ASC',
            };

            const response = await getTenantDeviceInfos(params);
            setDevices(response.data.data || []);
        } catch (error) {
            console.error('Failed to fetch devices', error);
        }
    };

    useEffect(() => {
        const fetchRoomsGridDg = async () => {
            await Promise.all([
                getAllRoomsfunc(),
                getAllDGsetsfunc(),
                getAllGridsfunc(),
                fetchDevices(),
                fetchWarehouseById(),
            ]);
        };

        fetchRoomsGridDg();
    }, [warehouseid]);

    const currentUser = useSelector((state: RootState) => state.user.user);

    const [allRooms, setAllRooms] = useState([]);
    const [allDGsets, setAllDGsets] = useState<dgset[]>([]);
    const [allGrids, setAllGrids] = useState<grid[]>([]);
    const [devices, setDevices] = useState<Device[]>([]);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [snackbarType, setSnackbarType] = useState<'success' | 'error'>(
        'success'
    );
    const [message, setMessage] = useState('');

    const handleReset = () => {
        if (!warehouseid) {
            setFormData(defaultWarehouse);
            setSubmitted(false);
        }
    };

    const handleChange = (e: any) => {
        const { name, value } = e.target;
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

    const handlePowerSourceToggle = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData((prev) => ({
            ...prev,
            powerSource: event.target.checked,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            await getCurrentUser();
            const convertedData = {
                ...formData,
                latitude: parseFloat(formData.latitude),
                longitude: parseFloat(formData.longitude),
                warehouse_dimensions: {
                    length: parseFloat(formData.warehouse_dimensions?.length),
                    width: parseFloat(formData.warehouse_dimensions?.width),
                    height: parseFloat(formData.warehouse_dimensions?.height),
                },
                cooling_units: Number(formData.cooling_units),
                sensors: Number(formData.sensors),
                userId: currentUser.id?.id,
                email: currentUser.email,
            };
            
            
            if (warehouseid) {

                const response = await updateWarehouseByWarehouseId(
                    warehouseid,
                    JSON.stringify(convertedData)
                );

                const updateDeviceBody = {
                    id: response.data.warehouse_id,
                    devices: formData.devices || [],
                };

                await updateDeviceLabels(updateDeviceBody);
                await AddWarehouseIdToRooms({ id: response.data.warehouse_id || "", rooms: formData.rooms || [] });
                await AddWarehouseIdToGrid({ id: response.data.warehouse_id || "", grids: formData.grid || []});
                await AddWarehouseIdToDGSet({ id: response.data.warehouse_id || "", dgsets: formData.dgset || []});
                setTimeout(() => {
                    setLoading(false);
                    setMessage('Warehouse Updated Successfully');
                    setOpen(true);
                    setSnackbarType('success');
                    setTimeout(() => {
                        navigate(`/Warehouse/${warehouseid}`)
                    }, 700)
                }, 600);
            } else {
                const response = await addWarehouse(
                    JSON.stringify(convertedData)
                );

                const updateDeviceBody = {
                    id: response.data.warehouse_id,
                    devices: formData.devices || [],
                };
                
                await updateDeviceLabels(updateDeviceBody);
                await AddWarehouseIdToRooms({ id: response.data.warehouse_id || "", rooms: formData.rooms || [] });
                await AddWarehouseIdToGrid({ id: response.data.warehouse_id || "", grids: formData.grid || []});
                await AddWarehouseIdToDGSet({ id: response.data.warehouse_id || "", dgsets: formData.dgset || []});
                setTimeout(() => {
                    setLoading(false);
                    setMessage('Warehouse Added Successfully');
                    setOpen(true);
                    setSnackbarType('success');
                    setTimeout(() => {
                        navigate(`/Warehouse/${warehouseid}`)
                    }, 700)
                }, 600);
            }
            setTimeout(() => {
                handleReset();
                setLoading(false);
                setOpen(true);
                setSnackbarType('success');
                fetchAllWarehouses();
            }, 1000);
        } catch (error: any) {
            setSnackbarType('error');

            if (error.status === 401) {
                setMessage('Session has expired. Navigating to login page.');
                setOpen(true);
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setTimeout(() => {
                    setMessage(warehouseid ? 'Failed to Update Warehouse' : 'Failed to Add Warehouse');
                    setLoading(false);
                    setOpen(true);
                }, 1000);
            }
        }
    };

    const warehousecountDispatch = useDispatch();

    const fetchAllWarehouses = async () => {
        try {
            const response = await getAllWarehouseByUserId(
                currentUser.id?.id,
                undefined
            );
            warehousecountDispatch(
                set_warehouse_count(response.data.totalElements)
            );
        } catch (error) {
            console.error('Failed to fetch warehouses:', error);
        }
    };

    return (
        <>
            <div className="menu-data">
                <div className="warehouse">
                    {warehouseid ? (
                        <h3>Warehouse: {formData.warehouse_name}</h3>
                    ) : (
                        <h3>Add Warehouse</h3>
                    )}

                    <form className="warehouse-form" onSubmit={handleSubmit}>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                label="Warehouse Name"
                                name="warehouse_name"
                                value={formData.warehouse_name}
                                onChange={handleChange}
                                disabled={submitted}
                                className="textfieldss"
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
                                className="textfieldss"
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
                                className="textfieldss"
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
                                className="textfieldss"
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
                                className="textfieldss"
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
                                className="textfieldss"
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
                                className="textfieldss"
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
                                className="textfieldss"
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
                                className="textfieldss"
                            />
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <InputLabel
                                className="input-label-select"
                                id="device-label"
                            >
                                Available Devices
                            </InputLabel>
                            <Select
                                labelId="device-label"
                                id="device-select"
                                name="devices"
                                value={formData.devices || []}
                                label={'Available Devices'}
                                onChange={(e: any) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        devices: e.target.value,
                                    }))
                                }
                                className="textfieldss"
                                required
                                multiple
                            >
                                {devices.map((item: Device, index: number) => (
                                    <MenuItem key={index} value={item.id?.id}>
                                        {item.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <InputLabel
                                className="input-label-select"
                                id="switch-label"
                            >
                                Available Rooms
                            </InputLabel>
                            <Select
                                labelId="Room-label"
                                id="Room-select"
                                name="rooms"
                                value={formData.rooms}
                                label={'Available rooms'}
                                onChange={handleChange}
                                className="textfieldss"
                                required
                                multiple
                            >
                                {allRooms.map((item: RoomType, index: number) => (
                                    <MenuItem key={index} value={item.room_id}>
                                        {item.room_name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <InputLabel
                                className="input-label-select"
                                id="switch-label"
                            >
                                Available Dgset
                            </InputLabel>
                            <Select
                                labelId="DGset-label"
                                id="Dgset-select"
                                name="dgset"
                                value={formData.dgset}
                                label={'Available DGset'}
                                onChange={handleChange}
                                className="textfieldss"
                                required
                                multiple
                            >
                                {allDGsets.map((item: dgset, index: number) => (
                                    <MenuItem key={index} value={item.dgset_id}>
                                        {item.dgset_name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <InputLabel
                                className="input-label-select"
                                id="switch-label"
                            >
                                Available Grid
                            </InputLabel>
                            <Select
                                labelId="Grid-label"
                                id="Grid-select"
                                name="grid"
                                value={formData.grid}
                                label={'Available Grid'}
                                onChange={handleChange}
                                className="textfieldss"
                                required
                                multiple
                            >
                                {allGrids.map((item: grid, index: number) => (
                                    <MenuItem key={index} value={item.grid_id}>
                                        {item.grid_name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formData.powerSource}
                                    onChange={handlePowerSourceToggle}
                                    name="powerSource"
                                    color="primary"
                                />
                            }
                            label={`Power Source: ${formData.powerSource ? 'DGSET' : 'GRID'
                                }`}
                        />

                        {warehouseid ? (
                            <div className="del-btn-warehouse">
                                <LoadingButton
                                    size="small"
                                    type="submit"
                                    color="secondary"
                                    loading={loading}
                                    loadingPosition="start"
                                    startIcon={<SaveIcon />}
                                    variant="contained"
                                    className="btn-save"
                                >
                                    <span>Update</span>
                                </LoadingButton>
                                <LoadingButton
                                    size="small"
                                    color="primary"
                                    loadingPosition="start"
                                    startIcon={<DeleteIcon />}
                                    variant="contained"
                                    disabled={loading}
                                    className="btn-save"
                                    onClick={() => { navigate(`/warehouse/${warehouseid}`) }}
                                >
                                    <span>Cancel</span>
                                </LoadingButton>
                            </div>
                        ) : (
                            <div className="sub-btn">
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
                        )}
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

export default AddWarehouse;
