import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteDevice, getDeviceById, saveDevice, getTenantDevices } from '../../api/deviceApi';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { Device, DeviceQueryParams } from '../../types/thingsboardTypes';
import Loader from '../Loader/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { set_DeviceCount } from '../../Redux/Action/Action';
import { Snackbar, SnackbarCloseReason, SnackbarContent } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ErrorIcon from '@mui/icons-material/Error';
import DeleteIcon from '@mui/icons-material/Delete';
import "./DeviceInfo.css";
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


const DeviceInfo: React.FC = () => {
  const { deviceId } = useParams();
  const navigate = useNavigate();
  const deviceCountDispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);

  const [deviceInfo, setDeviceInfo] = useState<Device>({});
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [admin, setAdmin] = useState('');
  const [action, setAction] = useState('');
  const [label, setLabel] = useState('');
  const [warehouse, setWarehouse] = useState<Warehouse[]>([]);
  const [warehouseInfo, setWarehouseInfo] = useState('');
  const [vehicle, setVehicle] = useState<Vehicle[]>([]);
  const [vehicleInfo, setVehicleInfo] = useState('');
  const [loaders, setLoaders] = useState(true);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');

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

  const fetchAllWarehouses = async () => {
    try {
      const currentUser = await getCurrentUser();
      const response = await mongoAPI.get(`/warehouse/getallwarehouse/${currentUser.data.id.id}`);
      setWarehouse(response.data);
    } catch (error) {
      console.error("Failed to fetch warehouses:", error);
    }
  };

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

  const handleAdminChange = (event: SelectChangeEvent) => setAdmin(event.target.value);
  const handleActionChange = (event: SelectChangeEvent) => setAction(event.target.value);

  const handleLabelChange = async (event: SelectChangeEvent) => {
    const selectedLabel = event.target.value;
    setLabel(selectedLabel);

    if (selectedLabel === 'warehouse') {
      fetchAllWarehouses();
    } else if (selectedLabel === 'vehicle') {
      try {
        const response = await mongoAPI.get(`/vehicle/getallvehicle/${user.id.id}`);
        setVehicle(response.data);
      } catch (error) {
        console.error("Failed to fetch vehicles:", error);
      }
    }
  };

  const handleWarehouseChange = (event: SelectChangeEvent) => {
    setWarehouseInfo(event.target.value);
    setDeviceInfo(prev => ({ ...prev, label: event.target.value }));
  };

  const handleVehicleChange = (event: SelectChangeEvent) => {
    setVehicleInfo(event.target.value);
    setDeviceInfo(prev => ({ ...prev, label: event.target.value }));
  };
  

  const handleClick = async () => {
    setLoadingSave(true);

    try {
      await saveDevice(deviceInfo);
      await fetchDevices(0);

      setTimeout(() => {
        setLoadingSave(false);
        setMessage('Device Updated successfully!');
        setSnackbarType('success');
        setOpen(true);
      }, 500);
    } catch (error) {
      console.log('Failed to create device');
      setTimeout(() => {
        setLoadingSave(false);
        setMessage('Device Already Exist');
        setSnackbarType('error');
        setOpen(true);
      }, 500);
    }
  };


  const handleDeleteDevice = async () => {
    setLoadingDelete(true);

    try {
      await deleteDevice(deviceId || "");

      setTimeout(() => {
        setLoadingDelete(false);
        setOpen(true);
        setMessage('Device Deleted');
        setSnackbarType("success");

        setTimeout(() => {
          navigate("/devices");
        }, 900);

      }, 900);

    } catch (error) {
      console.error('Failed to delete device', error);

      setTimeout(() => {
        setLoadingDelete(false);
        setOpen(true);
        setMessage('Failed to delete device');
        setSnackbarType("error");
      }, 500);
    }
  };

  const handleClose = (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') return;
    event
    setOpen(false);
  };

  useEffect(() => {
    const loaderTimeout = setTimeout(() => setLoaders(false), 1000);
    return () => clearTimeout(loaderTimeout);
  }, []);

  return (
    <>
      {loaders ? (
        <Loader />
      ) : (
        <div className="menu-data">
          <div className="add-device">
            <form>
              <label className="label">Device Info</label>
              <Box className="text-field-box">
                <TextField
                  fullWidth
                  label="Name"
                  onChange={(e) => setDeviceInfo(prev => ({ ...prev, name: e.target.value }))}
                  value={deviceInfo.name || ''}
                />
              </Box>
              <label className="label">Location</label>
              <FormControl className="form-control">
                <InputLabel id="location-label">Select Location</InputLabel>
                <Select
                  labelId="location-label"
                  id="location-select"
                  value={label}
                  label="Select Location"
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
              <label className="label">Type</label>
              <Box className="text-field-box">
                <TextField
                  fullWidth
                  label="Type"
                  onChange={(e) => setDeviceInfo(prev => ({ ...prev, type: e.target.value }))}
                  value={deviceInfo.type || ''}
                  className="textfiled"
                />
              </Box>
              <label className="label">Admin</label>
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
                  {/* Render user options here */}
                </Select>
              </FormControl>
              <label className="label">Action</label>
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
                  <MenuItem value="add">Add</MenuItem>
                  <MenuItem value="remove">Remove</MenuItem>
                </Select>
              </FormControl>
              <div className="accountinfo-savebtn-delete-btn">
                <LoadingButton
                  size="small"
                  color="secondary"
                  onClick={handleClick}
                  loading={loadingSave}
                  loadingPosition="start"
                  startIcon={<SaveIcon />}
                  variant="contained"
                  disabled={loadingDelete}
                  className="btn-save"
                >
                  <span>Save</span>
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
            color: 'white',
          }}
          message={
            <span style={{ display: 'flex', alignItems: 'center' }}>
              {snackbarType === 'success' ? (
                <CheckIcon style={{ marginRight: '8px' }} />
              ) : (
                <ErrorIcon style={{ marginRight: '8px' }} />
              )}
              {message}
            </span>
          }
        />
      </Snackbar>
    </>
  );
};

export default DeviceInfo;
