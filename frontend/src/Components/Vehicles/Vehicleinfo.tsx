import React, { useEffect, useState } from 'react';
import '../Add-Warehouse/Addwarehouse.css';
import {
  Button,
  FormControl,
  TextField,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import { mongoAPI } from '../../api/MongoAPIInstance';
import { getCurrentUser } from '../../api/loginApi';
import { useNavigate, useParams } from 'react-router-dom';
import './Vehicles.css';
import DeleteIcon from '@mui/icons-material/Delete';
import VehicleLoader from '../Loader/VehicleLoader';
import CustomSnackBar from '../SnackBar/SnackBar';
import { getVehicleByVehicleId } from '../../api/vehicleAPIs';

// Define interfaces for vehicle data
interface VehicleDimensions {
  length: string;
  width: string;
  height: string;
}

interface DriverDetails {
  driver_name: string;
  driver_contact_no: string;
  licence_id: string;
}

interface VehicleData {
  vehicle_number: string;
  vehicle_name: string;
  vehicle_dimensions: VehicleDimensions;
  Driver_details: DriverDetails;
  cooling_units: string | null;
  sensors: string | null;
  userId: string;
  email: string;
}

const AddVehicle: React.FC = () => {
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(true);
  const [deleteloading, setDeleteLoading] = useState(false);
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>(
    'success'
  );
  const [message, setMessage] = useState('');
  const { vehicleid } = useParams();
  const [isEdit, setIsEdit] = useState(true);

  const [formData, setFormData] = useState<VehicleData>({
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
  });

  useEffect(() => {
    if (vehicleid) {
      fetchVehicleById();
    }
  }, [vehicleid]);

  const fetchVehicleById = async () => {
    try {
      const response = await getVehicleByVehicleId(vehicleid);
      setFormData({
        ...response.data,
      });
    } catch (error) {
      console.error('Failed to fetch vehicle:', error);
    } finally {
      setTimeout(() => {
        setLoader(false);
      }, 700);
    }
  };

  const handleReset = () => {
    setFormData({
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
    });
    setSubmitted(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.startsWith('vehicle_dimensions.')) {
      const dimensionKey = name.split('.')[1] as keyof VehicleDimensions;
      setFormData((prev) => ({
        ...prev,
        vehicle_dimensions: {
          ...prev.vehicle_dimensions,
          [dimensionKey]: value,
        },
      }));
    } else if (name.startsWith('Driver_details.')) {
      // Ensure consistent naming
      const driverKey = name.split('.')[1] as keyof DriverDetails;
      setFormData((prev) => ({
        ...prev,
        Driver_details: {
          ...prev.Driver_details,
          [driverKey]: value,
        },
      }));
    } else {
      if (name === 'cooling_units' || name === 'sensors') {
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
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const currentUser = await getCurrentUser();

      const convertedData = {
        ...formData,
        vehicle_dimensions: {
          length: parseFloat(formData.vehicle_dimensions.length),
          width: parseFloat(formData.vehicle_dimensions.width),
          height: parseFloat(formData.vehicle_dimensions.height),
        },
        Driver_details: {
          ...formData.Driver_details,
          driver_contact_no: parseInt(
            formData.Driver_details.driver_contact_no,
            10
          ),
        },
        cooling_units:
          formData.cooling_units !== null
            ? Number(formData.cooling_units)
            : null,
        sensors: formData.sensors !== null ? Number(formData.sensors) : null,
        userId: currentUser.data.id.id,
        email: currentUser.data.email,
      };

      const apiEndpoint = vehicleid
        ? `vehicle/updatevehicle/${vehicleid}`
        : 'vehicle/addvehicle';
      if (vehicleid) {
        await mongoAPI.put(apiEndpoint, JSON.stringify(convertedData));
      } else {
        await mongoAPI.post(apiEndpoint, JSON.stringify(convertedData));
      }

      setTimeout(() => {
        handleReset();
        setLoading(false);
        setOpen(true);
        setSnackbarType('success');
        setMessage(
          vehicleid
            ? 'Vehicle Updated Successfully'
            : 'Vehicle Added Successfully'
        );
        setIsEdit(true);
        if (vehicleid) {
          fetchVehicleById();
        }
      }, 1000);
    } catch (error) {
      setTimeout(() => {
        setLoading(false);
        setOpen(true);
        setSnackbarType('error');
        setMessage('Failed to Save Vehicle');
        console.error('Error submitting form:', error);
      }, 1000);
    }
  };

  const navigate = useNavigate();

  const handleVehicleDelete = async () => {
    try {
      setDeleteLoading(true);
      await mongoAPI.delete(`vehicle/deletevehicle/${vehicleid}`);

      setTimeout(() => {
        setOpen(true);
        setSnackbarType('success');
        setMessage('Vehicle Deleted Successfully');

        setTimeout(() => {
          setDeleteLoading(false);
          navigate('/vehicles');
        }, 500);
      }, 500);
    } catch (error) {
      setDeleteLoading(false);
      setOpen(true);
      setSnackbarType('error');
      setMessage('Failed to Delete Vehicle');
      console.error('Error deleting vehicle:', error);
    }
  };


  return (
    <>
      {loader ? (
        <VehicleLoader />
      ) : (
        <div className="menu-data">
            <div className="warehouse">
            <h3>{vehicleid ? 'Edit Vehicle' : 'Add Vehicle'}</h3>
            <form className="warehouse-form" onSubmit={handleSubmit}>
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Vehicle Number"
                  name="vehicle_number"
                  value={formData.vehicle_number}
                  onChange={handleChange}
                  disabled={submitted}
                  className="textfieldss"
                  required
                  inputProps={{ readOnly: isEdit }}
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
                  required
                  inputProps={{ readOnly: isEdit }}
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
                  required
                  inputProps={{ readOnly: isEdit }}
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
                  required
                  inputProps={{ readOnly: isEdit }}
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
                  required
                  inputProps={{ readOnly: isEdit }}
                />
              </FormControl>

              <FormControl fullWidth margin="normal">
                <TextField
                  label="Driver Name"
                  name="Driver_details.driver_name"
                  value={formData.Driver_details.driver_name}
                  onChange={handleChange}
                  disabled={submitted}
                  className="textfieldss"
                  required
                  inputProps={{ readOnly: isEdit }}
                />
              </FormControl>

              <FormControl fullWidth margin="normal">
                <TextField
                  label="Driver Contact No"
                  name="Driver_details.driver_contact_no"
                  type="number"
                  value={formData.Driver_details.driver_contact_no}
                  onChange={handleChange}
                  disabled={submitted}
                  className="textfieldss"
                  required
                  inputProps={{ readOnly: isEdit }}
                />
              </FormControl>

              <FormControl fullWidth margin="normal">
                <TextField
                  label="Licence ID"
                  name="Driver_details.licence_id"
                  value={formData.Driver_details.licence_id}
                  onChange={handleChange}
                  disabled={submitted}
                  className="textfieldss"
                  required
                  inputProps={{ readOnly: isEdit }}
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
                  inputProps={{ readOnly: isEdit }}
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
                  inputProps={{ readOnly: isEdit }}
                />
              </FormControl>

              <div className="sub-btn-flex">
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
                      type="submit"
                      color="secondary"
                      loading={loading}
                      loadingPosition="start"
                      startIcon={<SaveIcon />}
                      variant="contained"
                      disabled={deleteloading}
                      className="btn-save"
                    >
                      <span>Update</span>
                    </LoadingButton>

                    <LoadingButton
                      size="small"
                      color="error"
                      loading={deleteloading}
                      loadingPosition="start"
                      startIcon={<DeleteIcon />}
                      variant="contained"
                      disabled={loading}
                      className="btn-save"
                      onClick={handleVehicleDelete}
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

export default AddVehicle;
