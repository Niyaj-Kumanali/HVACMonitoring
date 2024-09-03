import { Snackbar, SnackbarCloseReason, SnackbarContent } from '@mui/material';
import Loader from '../Loader/Loader';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import './Dashboards.css';
import { useEffect, useState } from 'react';
import {
  DashboardQueryParams,
  DashboardType,
  DeviceQueryParams,
} from '../../types/thingsboardTypes';
import { deleteDashboard, getTenantDashboards } from '../../api/dashboardApi';
import { useDispatch, useSelector } from 'react-redux';
import {
  set_Authority,
  set_DeviceCount,
  set_User,
  set_usersCount,
  set_vehicle_count,
  set_warehouse_count,
} from '../../Redux/Action/Action';
import { getUsers } from '../../api/userApi';
import { getTenantDevices } from '../../api/deviceApi';
import { useNavigate } from 'react-router-dom';
import { mongoAPI } from '../../api/MongoAPIInstance';
import { getCurrentUser } from '../../api/loginApi';

const Dashboard = () => {
  const currentuser = useSelector((state: any) => state.user.user);
  const [dashboards, setDashboards] = useState<DashboardType[]>([]);
  const [open, setOpen] = useState(false);
  const warecountdispatch = useDispatch();
  const usercountdispatch = useDispatch();
  const deviceCountDispatch = useDispatch();
  const vehicleCountDispatch = useDispatch();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoader] = useState(true);
  const authorityDispatch = useDispatch();
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState<string>('');

  const fetchUserData = async () => {
    try {
      const params = {
        pageSize: 16,
        page: 0,
      };
      const userData = await getUsers(params);
      usercountdispatch(set_usersCount(userData.data.data.length));
    } catch (error) {
      console.error('Failed to fetch user data', error);
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
      const devices = response.data.data || [];
      deviceCountDispatch(
        set_DeviceCount(devices.length >= 1 ? devices.length : 0)
      );
    } catch (error) {
      console.error('Failed to fetch devices', error);
    }
  };

  const fetchAllVehicles = async () => {
    try {
      const response = await mongoAPI.get(
        `vehicle/getallvehicle/${currentuser.id.id}`
      );
      console.log(response.data)
      console.log(response.data.length)
      vehicleCountDispatch(set_vehicle_count(response.data.length));
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
    }
  };

  const fetchAllWarehouses = async () => {
    try {
      const response = await mongoAPI.get(
        `/warehouse/getallwarehouse/${currentuser.id.id}`
      );
      warecountdispatch(set_warehouse_count(response.data.length));
      setLoader(false);
    } catch (error) {
      console.error('Failed to fetch warehouses:', error);
      warecountdispatch(set_warehouse_count(0));
    }
  };

  useEffect(() => {
    const currentUser = async () => {
      const response = await getCurrentUser();
      dispatch(set_User(response.data));
      return response.data;
    };

    fetchDashboards(0);
    currentUser();
    authorityDispatch(set_Authority(currentuser.authority));
    fetchUserData();
    fetchDevices(0);
    fetchAllVehicles();
    fetchAllWarehouses();
    
  }, [currentuser.id.id]);

  const fetchDashboards = async (page: number) => {
    try {
      const params: DashboardQueryParams = {
        pageSize: 10,
        page: page,
        textSearch: '',
        sortProperty: 'title',
        sortOrder: 'ASC',
      };
      const response = await getTenantDashboards(params);
      setDashboards(response.data.data ?? []);
      setTimeout(() => {
        setLoader(false);
      }, 500);
    } catch (error) {
      console.error('Failed to fetch dashboards', error);
      setError('No Dashboard Found');
      setShowError(true);
    } finally {
      setTimeout(() => {
        setLoader(false);
      }, 500);
    }
  };

  const handleDelete = async (dashboardId: string = '') => {
    try {
      await deleteDashboard(dashboardId);
      setOpen(true);
      fetchDashboards(0);
    } catch (error) {
      console.error('Failed to delete dashboard', error);
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

  const handleDashboardClick = (dashboardId: string = 'defaultId') => {
    if (dashboardId) {
      navigate(`/dashboard/${dashboardId}`);
    }
  };


  useEffect(() => {


    fetchUserData();
    fetchDevices(0);
    fetchAllVehicles();
    fetchAllWarehouses();
  }, [
    usercountdispatch,
    deviceCountDispatch,
    vehicleCountDispatch,
    warecountdispatch,
    currentuser.id.id
  ]);

  return (
    <>
      <div className="menu-data dashboard">
        <div className="devices">
          {loading ? (
            <Loader />
          ) : showError ? (
            <div>{error}</div>
          ) : (
            <>
              <h2>Dashboards</h2>
              <ul>
                {dashboards.map((dashboard, index) => (
                  <li key={index}>
                    <span
                      onClick={() => handleDashboardClick(dashboard.id?.id)}
                    >
                      {dashboard.title}
                    </span>
                    <div>
                      <IconButton aria-label="edit">
                        <EditIcon className="edit-icon" />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        onClick={() => handleDelete(dashboard.id?.id)}
                      >
                        <DeleteIcon className="delete-icon" />
                      </IconButton>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
        <Snackbar
          open={open}
          autoHideDuration={2000}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          style={{ marginTop: '64px' }}
        >
          <SnackbarContent
            style={{ backgroundColor: 'green', color: 'white' }}
            message={
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <CheckIcon style={{ marginRight: '8px' }} />
                Dashboard deleted successfully
              </span>
            }
          />
        </Snackbar>
      </div>
    </>
  );
};

export default Dashboard;
