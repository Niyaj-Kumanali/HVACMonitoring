import React, { useEffect, useState } from 'react';
import {
  Button,
  FormControl,
  Snackbar,
  SnackbarCloseReason,
  SnackbarContent,
  TextField,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import ErrorIcon from '@mui/icons-material/Error';
import SaveIcon from '@mui/icons-material/Save';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  deleteWarehouseByWarehouseId,
  getAllWarehouseByUserId,
  getLocationByLatsAndLongs,
  getWarehouseByWarehouseId,
  updateWarehouseByWarehouseId,
} from '../../api/MongoAPIInstance';

import { useDispatch, useSelector } from 'react-redux';
import { set_warehouse_count } from '../../Redux/Action/Action';
import { useNavigate, useParams } from 'react-router-dom';
import {
  WarehouseData,
  WarehouseDimensions,
} from '../../types/thingsboardTypes';
import { RootState } from '../../Redux/Reducer';

const Warehouse: React.FC = () => {
  const { warehouseid } = useParams();
  const currentUser = useSelector((state: RootState) => state.user.user)
  const [formData, setFormData] = useState<WarehouseData>({
    warehouse_name: '',
    latitude: '',
    longitude: '',
    warehouse_dimensions: {
      length: '0',
      width: '0',
      height: '0',
    },
    energy_resource: '',
    cooling_units: '',
    sensors: '',
    userId: '',
    email: '',
  });

  const [submitted, setSubmitted] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingg, setLoadingg] = useState(false);
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>(
    'success'
  );
  const [buttonvisible, setButtonVisible] = useState(false);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();
  const warehousecountDispatch = useDispatch();
  const [locationInfo, setLocationInfo] = useState<any>({});
  useEffect(() => {
    const fetchWarehouseById = async () => {
      const response = await getWarehouseByWarehouseId(warehouseid);

      setFormData({
        ...response.data,
      });
    };
    fetchWarehouseById();
  }, [warehouseid]);

  const handleDeleteWarehouse = async () => {
    setLoadingg(true);

    setTimeout(async () => {
      try {
        await deleteWarehouseByWarehouseId(warehouseid);
        fetchAllWarehouses();
        setSnackbarType('success');
        setMessage('Warehouse Deleted Successfully');
      } catch (error) {
        console.error('Error deleting warehouse:', error);
        setSnackbarType('error');
        setMessage('Failed to Delete Warehouse');
      }
      finally {
        setOpen(true);
        setTimeout(() => {
          setLoadingg(false);
          navigate('/warehouses');
        }, 700);
      }
    }, 1000);
  };

  const handleReset = () => {
    setFormData({
      warehouse_name: formData.warehouse_name,
      latitude: formData.latitude,
      longitude: formData.longitude,
      warehouse_dimensions: {
        length: formData.warehouse_dimensions?.length || '0',
        width: formData.warehouse_dimensions?.width || '0',
        height: formData.warehouse_dimensions?.height || '0',
      },
      energy_resource: formData.energy_resource,
      cooling_units: formData.cooling_units,
      sensors: formData.sensors,
      userId: formData.userId,
      email: formData.email,
    });
    setSubmitted(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.startsWith('warehouse_dimensions.')) {
      const dimensionKey = name.split('.')[1] as keyof WarehouseDimensions;
      setFormData((prev) => ({
        ...prev,
        warehouse_dimensions: {
          ...prev.warehouse_dimensions,
          [dimensionKey]: value,
        },
      }));
    } else if (name === 'cooling_units' || name === 'sensors') {
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
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    try {
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

      await updateWarehouseByWarehouseId(
        warehouseid,
        JSON.stringify(convertedData)
      );

      setTimeout(() => {
        setLoading(false);
        setOpen(true);
        setSnackbarType('success');
        setMessage('Warehouse Updated Successfully');
        fetchAllWarehouses();
        handleReset();
        setButtonVisible(false);
      }, 500);
    } catch (error) {
      setTimeout(() => {
        setLoading(false);
        setOpen(true);
        setSnackbarType('error');
        setMessage('Failed to Update Warehouse');
        console.error('Error submitting form:', error);
      }, 500);
    }
  };

  const fetchAllWarehouses = async () => {
    try {
      const response = await getAllWarehouseByUserId(
        currentUser.id?.id,
        undefined
      );

      warehousecountDispatch(set_warehouse_count(response.data.totalElements));
    } catch (error) {
      console.error('Failed to fetch warehouses:', error);
      warehousecountDispatch(set_warehouse_count(0));
    }
  };

  const handleClose = (
    _event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  const handleButtonVisible = () => {
    setButtonVisible(true);
  };

  useEffect(() => {
    const fetchLocationInfo = async (
      latitude: string,
      longitude: string,
      warehouseId: string
    ) => {
      try {
        const response = await getLocationByLatsAndLongs(latitude, longitude);
        if (!response.ok) {
            throw new Error('Failed to fetch location data');
        }

        const data: Location = await response.json();
        setLocationInfo({[warehouseId]: data });
      } catch (err: any) {
        console.error(
          `Error fetching location for warehouse ${warehouseId}:`,
          err.message
        );
      }
    };

    if (formData.latitude && formData.longitude) {

      fetchLocationInfo(
        formData.latitude,
        formData.longitude,
        warehouseid || ''
      );
    }
  }, [formData]);

  return (
    <div className="menu-data">
      <div className="cont">

        <div className={buttonvisible ? 'del-btn-warehouse-disalble' : 'warehouse-widgets'}>
          <div className="warehouse-widgets-info">
            <div className="warehouse-widgets-info-data">
              <div>
                <h3>
                  Name<p> : {formData.warehouse_name}</p>
                </h3>
                <h3>
                  Sensors<p> : {formData.sensors ?? ''}</p>
                </h3>
                <h3>
                  Location
                  <p>
                    :{' '}
                    {locationInfo[warehouseid || '']?.display_name ||
                      'Loading location...'}
                  </p>
                </h3>
              </div>
              <div>
                <Button variant="contained" onClick={handleButtonVisible}>
                  EDIT
                </Button>
              </div>
            </div>
            <div className="warehouse-widgets-info-data">
              <h3>Energy Consumed : {3}</h3>
            </div>
            <div className="warehouse-widgets-info-data">
              <h3>Occupancy : {5}</h3>
            </div>
          </div>
          <div className="warehouse-widgets-info">
            <div className="warehouse-widgets-info-data">
              <h3>Current Temp : {42}</h3>
            </div>
            <div className="warehouse-widgets-info-data">
              <h3>No of Violation : {10}</h3>
            </div>
            <div className="warehouse-widgets-info-data">
              <p>No of Times Doors opened : {19}</p>
            </div>
          </div>
        </div>

        <div
          className={buttonvisible ? 'warehouse-data' : 'del-btn-warehouse-disalble'}
        >
          <h3>Warehouse: {formData.warehouse_name}</h3>
          <form className="warehouse-form" onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Warehouse Name"
                name="warehouse_name"
                value={formData.warehouse_name}
                onChange={handleChange}
                disabled={submitted}
                className="textfieldss"
                inputProps={{
                  readOnly: buttonvisible ? false : true,
                }}
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
            <div className="del-btn-warehouse">
              <LoadingButton
                size="small"
                type="submit"
                color="secondary"
                loading={loading}
                loadingPosition="start"
                startIcon={<SaveIcon />}
                variant="contained"
                disabled={loadingg}
                className="btn-save"
              >
                <span>Update</span>
              </LoadingButton>
              <LoadingButton
                size="small"
                color="error"
                loading={loadingg}
                loadingPosition="start"
                startIcon={<DeleteIcon />}
                variant="contained"
                disabled={loading}
                className="btn-save"
                onClick={handleDeleteWarehouse}
              >
                <span>Delete</span>
              </LoadingButton>
            </div>
          </form>
        </div>
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
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
          message={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {snackbarType === 'success' ? <CheckIcon /> : <ErrorIcon />}
              <span>{message}</span>
            </div>
          }
        />
      </Snackbar>
    </div>
  );
};

export default Warehouse;
