import React, { useState } from 'react';
import '../Add-Warehouse/Addwarehouse.css';
import {
  FormControl,
  TextField,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import './Addvehicle.css';
import { set_vehicle_count } from '../../Redux/Action/Action';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../Redux/Reducer';
import {
  DriverDetails,
  VehicleData,
  VehicleDimensions,
} from '../../types/thingsboardTypes';
import CustomSnackBar from '../SnackBar/SnackBar';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../api/loginApi';
import { addVehicle, getAllVehiclesByUserId } from '../../api/vehicleAPIs';

const AddVehicle: React.FC = () => {
  const navigate = useNavigate()
  const currentUser = useSelector((state: RootState) => state.user.user);
  const defaultVehicle = {
    vehicle_number: '',
    vehicle_name: '',
    vehicle_dimensions: {
      length: '',
      width: '',
      height: '',
    },
    Driver_details: {
      driver_name: '',
      driver_contact_no: '',
      licence_id: '',
    },
    cooling_units: null,
    sensors: null,
    userId: '',
    email: '',
  };

  const [submitted, setSubmitted] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>(
    'success'
  );
  const [message, setMessage] = useState('');
  const vehicleCountDispatch = useDispatch();

  const [formData, setFormData] = useState<VehicleData>(defaultVehicle);

  const handleReset = () => {
    setFormData(defaultVehicle);
    setSubmitted(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Handle dimensions and driver details updates
    if (name.startsWith('vehicle_dimensions.')) {
      const dimensionKey = name.split('.')[1] as keyof VehicleDimensions;
      setFormData({
        ...formData,
        vehicle_dimensions: {
          ...formData.vehicle_dimensions,
          [dimensionKey]: value,
        },
      });
    } else if (name.startsWith('driver_details.')) {
      const driverKey = name.split('.')[1] as keyof DriverDetails;
      setFormData({
        ...formData,
        Driver_details: {
          ...formData.Driver_details,
          [driverKey]: value,
        },
      });
    } else {
      // Handle number inputs
      if (name === 'cooling_units' || name === 'sensors') {
        setFormData({
          ...formData,
          [name]: value === '' ? null : value,
        });
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

    const convertedData = {
      ...formData,
      vehicle_dimensions: {
        length: parseFloat(formData.vehicle_dimensions.length),
        width: parseFloat(formData.vehicle_dimensions.width),
        height: parseFloat(formData.vehicle_dimensions.height),
      },
      driver_details: {
        driver_contact_no: parseInt(
          formData.Driver_details.driver_contact_no,
          10
        ),
      },
      cooling_units: Number(formData.cooling_units),
      sensors: Number(formData.sensors),
      userId: currentUser.id?.id,
      email: currentUser.email,
    };

    try {
      await getCurrentUser()
      await addVehicle(JSON.stringify(convertedData));

      setTimeout(() => {
        handleReset();
        setLoading(false);
        setOpen(true);
        setSnackbarType('success');
        setMessage('Vehicle Added Successfully');
        fetchAllVehicles();
      }, 1000);
    } catch (error:any) {
      setSnackbarType('error');

      if (error.status === 401) {
        setMessage('Session has expired navigating to login page');
        setOpen(true);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }else{
        setTimeout(() => {
          setLoading(false);
          setOpen(true);
          setMessage('Failed to Add Vehicle');
        }, 1000);
      }

    }
  };

  const fetchAllVehicles = async () => {
    try {
      const response = await getAllVehiclesByUserId(
        currentUser.id?.id,
        undefined
      );
      vehicleCountDispatch(set_vehicle_count(response.data.totalElements));
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
    }
  };


  return (
    <>
      <div className="menu-data">
        <div className="vehicle">
          <h3>Add Vehicle</h3>
          <form className="vehicle-form" onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Vehicle Number"
                name="vehicle_number"
                value={formData.vehicle_number}
                onChange={handleChange}
                disabled={submitted}
                className="textfieldss"
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Vehicle Name"
                name="vehicle_name"
                value={formData.vehicle_name}
                onChange={handleChange}
                disabled={submitted}
                className="textfieldss"
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Length"
                name="vehicle_dimensions.length"
                type="number"
                value={formData.vehicle_dimensions.length}
                onChange={handleChange}
                disabled={submitted}
                className="textfieldss"
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Width"
                name="vehicle_dimensions.width"
                type="number"
                value={formData.vehicle_dimensions.width}
                onChange={handleChange}
                disabled={submitted}
                className="textfieldss"
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Height"
                name="vehicle_dimensions.height"
                type="number"
                value={formData.vehicle_dimensions.height}
                onChange={handleChange}
                disabled={submitted}
                className="textfieldss"
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Driver Name"
                name="driver_details.driver_name"
                value={formData.Driver_details.driver_name}
                onChange={handleChange}
                disabled={submitted}
                className="textfieldss"
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Driver Contact No"
                name="driver_details.driver_contact_no"
                type="number"
                value={formData.Driver_details.driver_contact_no}
                onChange={handleChange}
                disabled={submitted}
                className="textfieldss"
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Licence ID"
                name="driver_details.licence_id"
                value={formData.Driver_details.licence_id}
                onChange={handleChange}
                disabled={submitted}
                className="textfieldss"
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Cooling Units"
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
                label="Sensors"
                name="sensors"
                type="number"
                value={formData.sensors ?? ''}
                onChange={handleChange}
                disabled={submitted}
                className="textfieldss"
              />
            </FormControl>
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

export default AddVehicle;
