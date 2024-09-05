import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  deleteDevice,
  getDeviceById,
  saveDevice,
  getTenantDevices,
  getDeviceCredentialsByDeviceId,
} from '../../api/deviceApi';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
import ShareIcon from '@mui/icons-material/Share';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import {
  Device,
  DeviceQueryParams,
  PageData,
} from '../../types/thingsboardTypes';
import Loader from '../Loader/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { set_DeviceCount } from '../../Redux/Action/Action';
import {
  Button,
  Snackbar,
  SnackbarCloseReason,
  SnackbarContent,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ErrorIcon from '@mui/icons-material/Error';
import DeleteIcon from '@mui/icons-material/Delete';
import './DeviceInfo.css';
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
  const [accessToken, setAccessToken] = useState<string>('');
  console.log(accessToken);

  const [deviceInfo, setDeviceInfo] = useState<Device>({
    type: 'default',
  });
  const [loading, setLoading] = useState(false);
  const [admin, setAdmin] = useState('');
  const [action, setAction] = useState('');
  const [warehouse, setWarehouse] = useState<Warehouse[]>([]);
  const [vehicle, setVehicle] = useState<Vehicle[]>([]);
  const [loaders, setLoaders] = useState(true);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>(
    'success'
  );

  const fetchAllWarehouses = async () => {
    try {
      const response = await mongoAPI.get(
        `/warehouse/getallwarehouse/${user.id.id}`
      );
      setWarehouse(response.data);
    } catch (error) {
      console.error('Failed to fetch warehouses:', error);
    }
  };
  const fetchAllVehicles = async () => {
    try {
      const response = await mongoAPI.get(
        `/vehicle/getallvehicle/${user.id.id}`
      );
      setVehicle(response.data);
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
    }
  };

  const fetchDeviceInfo = async () => {
    setLoading(true);
    try {
      const response = await getDeviceById(deviceId);
      setDeviceInfo(response.data);
      const responseForCreds = await getDeviceCredentialsByDeviceId(
        deviceId || ''
      );
      console.log(responseForCreds.data);
      setAccessToken(responseForCreds.data.credentialsId);
    } catch (error) {
      console.error('Error fetching device info:', error);
      setMessage('Failed to fetch device information.');
      setSnackbarType('error');
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchDevices = async (page: number): Promise<void> => {
    try {
      const params: DeviceQueryParams = {
        pageSize: 10,
        page: page,
        type: '',
        textSearch: '',
        sortProperty: 'name',
        sortOrder: 'DESC',
      };

      const response: PageData<Device> = await getTenantDevices(params);
      deviceCountDispatch(set_DeviceCount(response.totalElements || 0));
    } catch (error) {
      console.error('Failed to fetch devices', error);
    }
  };

  const handleAdminChange = (event: SelectChangeEvent) =>
    setAdmin(event.target.value);
  const handleActionChange = (event: SelectChangeEvent) =>
    setAction(event.target.value);

  const handleLabelChange = async (event: SelectChangeEvent) => {
    const selectedLabel = event.target.value;
    setDeviceInfo((prev) => ({
      ...prev,
      additionalInfo: { ...prev.additionalInfo, labelType: event.target.value },
    }));

    if (selectedLabel === 'warehouse') {
      fetchAllWarehouses();
    } else if (selectedLabel === 'vehicle') {
      fetchAllVehicles();
    }
  };

  const handleWarehouseChange = (event: SelectChangeEvent) => {
    setDeviceInfo((prev) => ({ ...prev, label: event.target.value }));
  };

  const handleVehicleChange = (event: SelectChangeEvent) => {
    setDeviceInfo((prev) => ({ ...prev, label: event.target.value }));
  };

  const handleClick = async () => {
    setLoading(true);

    if (deviceInfo.name === '' || deviceInfo.type === '') {
      setLoading(false);
      setMessage('Fill the requiered fields!');
      setSnackbarType('error');
      setOpen(true);
      return;
    }
    try {
      await saveDevice(deviceInfo);
      await fetchDevices(0);

      setMessage('Device added successfully!');
      setSnackbarType('success');
    } catch (error) {
      console.error('Failed to create device', error);
      setMessage('Device Already Exist');
      setSnackbarType('error');
    } finally {
      setLoading(false);
      setOpen(true);
    }
  };

  const handleDeleteDevice = async () => {
    setLoading(true);
    try {
      await deleteDevice(deviceId || '');

      setMessage('Device Deleted');
      setSnackbarType('success');
      setTimeout(() => navigate('/devices'), 900);
    } catch (error) {
      console.error('Failed to delete device', error);
      setMessage('Failed to delete device');
      setSnackbarType('error');
    } finally {
      setLoading(false);
      setOpen(true);
    }
  };

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === 'clickaway') return;
    event;
    setOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDeviceInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleCopyAccessToken = () => {
    navigator.clipboard
      .writeText(accessToken)
      .then(() => {
        setMessage('Access Token copied to clipboard!');
        setSnackbarType('success');
        setOpen(true);
      })
      .catch((error) => {
        console.error('Failed to copy access token:', error);
        setMessage('Failed to copy access token');
        setSnackbarType('error');
        setOpen(true);
      });
  };

  const handleCopyId = () => {
    navigator.clipboard
      .writeText(deviceId || '')
      .then(() => {
        setMessage('Device ID copied to clipboard!');
        setSnackbarType('success');
        setOpen(true);
      })
      .catch((error) => {
        console.error('Failed to copy Device ID:', error);
        setMessage('Failed to copy Device ID');
        setSnackbarType('error');
        setOpen(true);
      });
  };

  useEffect(() => {
    fetchDeviceInfo();
  }, [deviceId]);

  useEffect(() => {
    fetchDeviceInfo();
    fetchAllWarehouses();
    fetchAllVehicles();
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
              <div className="header-container">
                <label className="label">Device Info</label>
                <div className="buttons">
                  <Button
                    variant="outlined" // Use 'outlined' for a transparent background
                    color="primary" // Sets the text and border color
                    onClick={handleCopyId}
                    startIcon={<ShareIcon />}
                    sx={{
                      ml: 2,
                      backgroundColor: 'transparent', // Make the background transparent
                      border: '1px solid', // Optional: Add border to distinguish button
                      borderColor: 'primary.main', // Border color
                      color: 'primary.main', // Text color
                      '&:hover': {
                        backgroundColor: 'primary.light', // Background color on hover
                        color: 'primary.contrastText', // Text color on hover
                      },
                    }}
                  >
                    Copy Id
                  </Button>
                  <Button
                    variant="outlined" // Use 'outlined' for a transparent background
                    color="primary" // Sets the text and border color
                    onClick={handleCopyAccessToken}
                    startIcon={<ShareIcon />}
                    sx={{
                      ml: 2,
                      backgroundColor: 'transparent', // Make the background transparent
                      border: '1px solid', // Optional: Add border to distinguish button
                      borderColor: 'primary.main', // Border color
                      color: 'primary.main', // Text color
                      '&:hover': {
                        backgroundColor: 'primary.light', // Background color on hover
                        color: 'primary.contrastText', // Text color on hover
                      },
                    }}
                  >
                    Copy Token
                  </Button>
                </div>
              </div>
              <Box className="text-field-box">
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  onChange={handleInputChange}
                  value={deviceInfo.name || ''}
                  required
                />
              </Box>
              <label className="label">Location</label>
              <FormControl className="form-control">
                <InputLabel id="location-label">Select Location</InputLabel>
                <Select
                  labelId="location-label"
                  id="location-select"
                  value={deviceInfo.additionalInfo?.labelType || ''}
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
              {deviceInfo.additionalInfo?.labelType === 'warehouse' && (
                <FormControl className="form-control">
                  <InputLabel id="warehouse-label">Select Warehouse</InputLabel>
                  <Select
                    labelId="warehouse-label"
                    id="warehouse-select"
                    value={deviceInfo.label}
                    label="Select Warehouse"
                    onChange={handleWarehouseChange}
                    className="form-control-inner"
                  >
                    {warehouse.map((wh, index) => (
                      <MenuItem key={index} value={wh.warehouse_id}>
                        {wh.warehouse_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              {deviceInfo.additionalInfo?.labelType === 'vehicle' && (
                <FormControl className="form-control">
                  <InputLabel id="vehicle-label">Select Vehicle</InputLabel>
                  <Select
                    labelId="vehicle-label"
                    id="vehicle-select"
                    value={deviceInfo.label}
                    label="Select Vehicle"
                    onChange={handleVehicleChange}
                    className="form-control-inner"
                  >
                    {vehicle.map((veh, index) => (
                      <MenuItem key={index} value={veh.vehicle_id}>
                        {veh.vehicle_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              <label className="label">Type</label>
              <Box className="text-field-box">
                <TextField
                  fullWidth
                  label="Type"
                  name="type"
                  onChange={handleInputChange}
                  value={deviceInfo.type || ''}
                  required
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
                  loading={loading}
                  loadingPosition="start"
                  startIcon={<SaveIcon />}
                  variant="contained"
                  disabled={loading}
                  className="btn-save"
                >
                  <span>Save</span>
                </LoadingButton>
                <LoadingButton
                  size="small"
                  color="error"
                  onClick={handleDeleteDevice}
                  loading={loading}
                  loadingPosition="start"
                  startIcon={<DeleteIcon />}
                  variant="contained"
                  disabled={loading}
                  className="btn-save"
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
        </div>
      )}
    </>
  );
};

export default DeviceInfo;
