import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteDevice, getDeviceById } from '../../api/deviceApi';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import {
  Device,
  DeviceQueryParams,
  PageData,
} from '../../types/thingsboardTypes';
import { saveDevice, getTenantDevices } from '../../api/deviceApi';
import Loader from '../Loader/Loader';
import { useDispatch } from 'react-redux';
import { set_DeviceCount } from '../../Redux/Action/Action';
import { Snackbar, SnackbarCloseReason, SnackbarContent } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ErrorIcon from '@mui/icons-material/Error';
import DeleteIcon from '@mui/icons-material/Delete';
import "./DeviceInfo.css"


const DeviceInfo: React.FC = () => {
  const { deviceId } = useParams();
  const [deviceInfo, setDeviceInfo] = useState<Device>({});
  const [loading, setLoading] = useState(false);
  const [admin, setAdmin] = useState('');
  const [location, setLocation] = useState('');
  const [action, setAction] = useState('');

  const [loaders, setLoaders] = useState(true);
  const deviceCountDispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>(
    'success'
  );

  useEffect(() => {
    const fetchDeviceInfo = async () => {
      try {
        const deviceData = await getDeviceById(deviceId);
        setDeviceInfo(deviceData.data);
      } catch (error) {
        console.error('Error fetching device info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeviceInfo();
  }, [deviceId]);

  const handleAdminChange = (event: SelectChangeEvent) => {
    setAdmin(event.target.value);
  };

  const handleLocationChange = (event: SelectChangeEvent) => {
    setLocation(event.target.value);
  };

  const handleActionChange = (event: SelectChangeEvent) => {
    setAction(event.target.value);
  };

  setTimeout(() => {
    setLoaders(false);
  }, 1000);

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

  const handleClick = async () => {
    setLoading(true);

    try {
      await saveDevice(deviceInfo);
      await fetchDevices(0);

      setTimeout(() => {
        setLoading(false);
        setMessage('Device added successfully!');
        setSnackbarType('success');
        setOpen(true);
      }, 500);
    } catch (error) {
      console.log('Failed to create device');
      setTimeout(() => {
        setLoading(false);
        setMessage('Device Already Exist');
        setSnackbarType('error');
        setOpen(true);
      }, 500);
    }
  };
  
  const navigate = useNavigate();

  const handleDeleteDevice = async () => {
    setLoading(true);

    try {
      await deleteDevice(deviceId || "");

      setTimeout(() => {
        setLoading(false);
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
        setLoading(false);
        setOpen(true);
        setMessage('Failed to delete device');
        setSnackbarType("error");
      }, 500);
    }
  };



  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === 'clickaway') {
      event;
      return;
    }

    setOpen(false);
  };

  return (
    <>
      {loaders ? (
        <Loader />
      ) : (
        <div className="menu-data">
          <div className="add-device">
            <form>
              <label htmlFor="" className="label">
                Device Info
              </label>
              <Box className="text-field-box">
                <TextField
                  fullWidth
                  label="Name"
                  onChange={(e) =>
                    setDeviceInfo((prev) => ({ ...prev, name: e.target.value }))
                  }
                  value={deviceInfo.name || ''}
                />
              </Box>
              <label htmlFor="" className="label">
                Label
              </label>
              <Box className="text-field-box">
                <TextField
                  fullWidth
                  label="Label"
                  onChange={(e) =>
                    setDeviceInfo((prev) => ({
                      ...prev,
                      label: e.target.value,
                    }))
                  }
                  value={deviceInfo.label || ''}
                  className="textfiled"
                />
              </Box>
              <label htmlFor="" className="label">
                Type
              </label>
              <Box className="text-field-box">
                <TextField
                  fullWidth
                  label="type"
                  onChange={(e) =>
                    setDeviceInfo((prev) => ({ ...prev, type: e.target.value }))
                  }
                  value={deviceInfo.type || ''}
                  className="textfiled"
                />
              </Box>
              <label htmlFor="" className="label">
                Admin
              </label>
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
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
              <label htmlFor="" className="label">
                Location
              </label>
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
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
              <label htmlFor="" className="label">
                Action
              </label>
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
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
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
