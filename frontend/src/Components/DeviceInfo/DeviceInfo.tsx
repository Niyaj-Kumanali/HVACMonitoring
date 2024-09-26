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
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { Device, DeviceQueryParams } from '../../types/thingsboardTypes';

import Loader from '../Loader/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { set_DeviceCount } from '../../Redux/Action/Action';
import {
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import './DeviceInfo.css';
import {
  getAllVehiclesByUserId,
  getAllWarehouseByUserId,
} from '../../api/MongoAPIInstance';
import CustomSnackBar from '../SnackBar/SnackBar';
import { RootState } from '../../Redux/Reducer';
import { log } from 'console';

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
  const user = useSelector((state: RootState) => state.user.user);
  const [accessToken, setAccessToken] = useState<string>('');

  const [isEdit, setIsEdit] = useState(true);

  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState<Device>({
    type: 'default',
  });
  // const [loading, setLoading] = useState(false);

  const [action, setAction] = useState('');
  const [warehouse, setWarehouse] = useState<Warehouse[]>([]);
  const [vehicle, setVehicle] = useState<Vehicle[]>([]);
  const [loaders, setLoaders] = useState(true);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>(
    'success'
  );

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
      const params = {
        pageSize: 100,
        page: 0,
      };
      const response = await getAllWarehouseByUserId(user.id?.id, params);
      setWarehouse(response.data.data);
    } catch (error) {
      console.error('Failed to fetch warehouses:', error);
    }
  };
  const fetchAllVehicles = async () => {
    try {
      const params = {
        pageSize: 100,
        page: 0,
      };
      const response = await getAllVehiclesByUserId(user.id?.id, params);
      setVehicle(response.data.data);
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
    }
  };

  const fetchDeviceInfo = async () => {
    try {
      const response = await getDeviceById(deviceId);
      setDeviceInfo(response.data);
      const responseForCreds = await getDeviceCredentialsByDeviceId(
        deviceId || ''
      );
      setAccessToken(responseForCreds.data.credentialsId);
    } catch (error) {
      console.error('Error fetching device info:', error);
      setMessage('Failed to fetch device information.');
      setSnackbarType('error');
      setOpen(true);
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

  const handleActionChange = (event: SelectChangeEvent) =>
    setAction(event.target.value);

  const handleLabelChange = async (event: SelectChangeEvent) => {
    const selectedLabel = event.target.value;
    setDeviceInfo((prev) => ({
      ...prev,
      additionalInfo: { ...prev.additionalInfo, labelType: event.target.value },
      label: "",
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
    setLoadingSave(true);

    if (!deviceInfo.name || !deviceInfo.type || !deviceInfo.label || !deviceInfo.additionalInfo.labelType) {
      setMessage('Fill the requiered fields!');
      setSnackbarType('error');
      setLoadingSave(false);
      setOpen(true);
      return;
    }

    try {
      await saveDevice(deviceInfo);
      await fetchDevices(0);

      setTimeout(() => {
        setLoadingSave(false);
        setMessage('Device Updated successfully!');
        setSnackbarType('success');
        setOpen(true);
        setIsEdit(true);
      }, 500);
    } catch (error) {
      console.error('Error updating device', error)
      setTimeout(() => {
        setLoadingSave(false);
        setMessage('Error updating device');
        setSnackbarType('error');
        setOpen(true);
      }, 500);
    }
  };

  const handleDeleteDevice = async () => {
    setLoadingDelete(true);

    try {
      await deleteDevice(deviceId || '');
      setTimeout(() => {
        setLoadingDelete(false);
        setOpen(true);
        setMessage('Device Deleted');
        setSnackbarType('success');

        setTimeout(() => {
          navigate('/devices');
        }, 900);
      }, 900);
    } catch (error:any) {
      console.error('Failed to delete device', error);
      setSnackbarType('error');
      setLoadingDelete(false);
      if (error.status === 401) {
        setMessage('Session has expired navigating to login page');
        setOpen(true)
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }else{
        setMessage('Failed to delete device');
        setTimeout(() => {
          setOpen(true);
        }, 500);
      }



    }
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDeviceInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setMessage('Copied to clipboard!');
      setSnackbarType('success');
    } catch (error) {
      console.error('Failed to copy:', error);
      setMessage('Failed to copy to clipboard!');
      setSnackbarType('error');
    } finally {
      setOpen(true);
    }
  };

  useEffect(() => {
    fetchDeviceInfo();
  }, [deviceId]);

  useEffect(() => {
    fetchDeviceInfo();
    fetchAllWarehouses();
    fetchAllVehicles();
    const loaderTimeout = setTimeout(() => setLoaders(false), 700);
    return () => clearTimeout(loaderTimeout);
  }, []);

  const goBack = () => {
    navigate(-1);
  };

  return (
    <>
      {loaders ? (
        <div className="menu-data">
          <Loader />
        </div>
      ) : (
        <div className="menu-data">
          <div className="add-device">
            <form>
              <div className="header-container">
                <label className="label">
                  <KeyboardBackspaceIcon onClick={goBack} />
                  Device Info
                </label>
                <div className="buttons">
                  <Button
                    variant="outlined" // Use 'outlined' for a transparent background
                    color="primary" // Sets the text and border color
                    onClick={() => handleCopy(deviceId || '')}
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
                    onClick={() => handleCopy(accessToken)}
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
                  inputProps={{readOnly: isEdit}}
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
                  required
                  inputProps={{readOnly: isEdit}}
                >
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
                    required
                    inputProps={{readOnly: isEdit}}
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
                    required
                    inputProps={{readOnly: isEdit}}
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
                  inputProps={{readOnly: isEdit}}
                />
              </Box>
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
                  required
                  inputProps={{readOnly: isEdit}}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="add">Add</MenuItem>
                  <MenuItem value="remove">Remove</MenuItem>
                </Select>
              </FormControl>
              <div className="accountinfo-savebtn-delete-btn">
                {isEdit ? (
                  <Button
                    className="btn-save"
                    variant="contained"
                    onClick={() => setIsEdit(false)}
                  >
                    Edit
                  </Button>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
      <CustomSnackBar
        open={open}
        setOpen={setOpen}
        snackbarType={snackbarType}
        message={message}
      />
    </>
  );
};

export default DeviceInfo;
