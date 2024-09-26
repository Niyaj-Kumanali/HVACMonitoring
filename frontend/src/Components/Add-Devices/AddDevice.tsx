import './AddDevice.css';
import { useState, useEffect } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
import { Device, DeviceQueryParams } from '../../types/thingsboardTypes';
import { saveDevice, getTenantDevices } from '../../api/deviceApi';
import Loader from '../Loader/Loader';
import { useDispatch } from 'react-redux';
import { set_DeviceCount } from '../../Redux/Action/Action';
import { getCurrentUser } from '../../api/loginApi';
import { mongoAPI } from '../../api/MongoAPIInstance';
import CustomSnackBar from '../SnackBar/SnackBar';
import { useNavigate } from 'react-router-dom';
import { SelectChangeEvent, Box, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

interface Warehouse {
  warehouse_id: string;
  warehouse_name: string;
}

interface Vehicle {
  vehicle_id: string;
  vehicle_name: string;
}

const AddDevice = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState('');
  const [warehouse, setWarehouse] = useState<Warehouse[]>([]);
  const [vehicle, setVehicle] = useState<Vehicle[]>([]);
  const [loaders, setLoaders] = useState(true);
  const deviceCountDispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>(
    'success'
  );

  const [deviceInfo, setDeviceInfo] = useState<Device>({
    type: 'default',
    additionalInfo: {
      labelType: 'warehouse'
    }
  });

  const fetchWarehousesAndVehicles = async () => {
    try {
      const currentUser = await getCurrentUser();
      const warehouseResponse = await mongoAPI.get(
        `/warehouse/getallwarehouse/${currentUser.data.id.id}`
      );
      setWarehouse(warehouseResponse.data.data);

      const vehicleResponse = await mongoAPI.get(
        `/vehicle/getallvehicle/${currentUser.data.id.id}`
      );
      setVehicle(vehicleResponse.data.data);
    } catch (error) {
      console.error('Failed to fetch warehouses or vehicles:', error);
    }
  };

  useEffect(() => {
    fetchWarehousesAndVehicles();
  }, []);

  const handleActionChange = (event: SelectChangeEvent) => {
    setAction(event.target.value);
  };

  const handleLocationChange = async (event: SelectChangeEvent) => {
    setDeviceInfo((prev) => ({
      ...prev,
      additionalInfo: { ...prev.additionalInfo, labelType: event.target.value },
    }));
  };

  setTimeout(() => {
    setLoaders(false);
  }, 700);

  const fetchDevices = async (page: number): Promise<void> => {
    try {
      const params: DeviceQueryParams = {
        pageSize: 10,
        page: page,
      };

      const response = await getTenantDevices(params);
      deviceCountDispatch(set_DeviceCount(response.data.totalElements || 0));
    } catch (error) {
      console.error('Failed to fetch devices', error);
    }
  };

  const handleClick = async () => {
    setLoading(true);
    if (!deviceInfo.name|| !deviceInfo.type || !deviceInfo.label) {
      setLoading(false);
      setMessage('Fill the requiered fields!');
      setSnackbarType('error');
      setOpen(true);
      return;
    }

    try {
      await saveDevice(deviceInfo);
      await fetchDevices(0);

      setDeviceInfo({
        type: 'default',
        additionalInfo: {
          labelType: 'warehouse'
        }
      });
      setAction('');
      setMessage('Device added successfully!');
      setSnackbarType('success');
    } catch (error: any) {
      setSnackbarType('error');
      if (error.status === 400) {
        setMessage('Device Already Exist');
      } else if (error.status === 401) {
        setMessage('Session has expired navigating to login page');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setMessage('Error Adding Device');
      }
    } finally {
      setTimeout(() => {
        setLoading(false);
        setOpen(true);
      }, 500);
    }
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
              <label htmlFor="" className="label">
                Add Device
              </label>
              <Box className="text-field-box">
                <TextField
                  fullWidth
                  label="Name"
                  onChange={(e) =>
                    setDeviceInfo((prev) => ({ ...prev, name: e.target.value }))
                  }
                  value={deviceInfo.name || ''}
                  required
                />
              </Box>
              <label htmlFor="" className="label">
                Location
              </label>
              <div></div>
              <FormControl className="form-control" required>
                <InputLabel id="location-label">Select Location</InputLabel>
                <Select
                  labelId="location-label"
                  id="location-select"
                  value={deviceInfo.additionalInfo?.labelType || 'warehouse'}
                  label="Select Location"
                  onChange={handleLocationChange}
                  className="form-control-inner"
                >
                  <MenuItem value="warehouse">Warehouse</MenuItem>
                  <MenuItem value="vehicle">Vehicle</MenuItem>
                </Select>
              </FormControl>
              {deviceInfo.additionalInfo?.labelType === 'warehouse' && (
                <FormControl className="form-control" required>
                  <InputLabel id="warehouse-label">Select Warehouse</InputLabel>
                  <Select
                    labelId="warehouse-label"
                    id="warehouse-select"
                    value={deviceInfo.label}
                    label="Select Warehouse"
                    onChange={(e) =>
                      setDeviceInfo((prev) => ({
                        ...prev,
                        label: e.target.value,
                      }))
                    }
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
                <FormControl className="form-control" required>
                  <InputLabel id="vehicle-label">Select Vehicle</InputLabel>
                  <Select
                    labelId="vehicle-label"
                    id="vehicle-select"
                    value={deviceInfo.label}
                    label="Select Vehicle"
                    onChange={(e) =>
                      setDeviceInfo((prev) => ({
                        ...prev,
                        label: e.target.value,
                      }))
                    }
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
              <label htmlFor="" className="label">
                Type
              </label>
              <Box className="text-field-box">
                <TextField
                  fullWidth
                  label="Select Type"
                  name="type"
                  onChange={(e) =>
                    setDeviceInfo((prev) => ({ ...prev, type: e.target.value }))
                  }
                  value={deviceInfo.type || ''}
                  required
                />
              </Box>
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

export default AddDevice;
