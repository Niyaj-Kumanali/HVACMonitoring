import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Snackbar,
  SnackbarCloseReason,
  SnackbarContent,
  IconButton,
} from '@mui/material';
import Loader from '../Loader/Loader';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import AddIcon from '@mui/icons-material/Add';
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
import { getAllVehiclesByUserId, getAllWarehouseByUserId } from '../../api/MongoAPIInstance';
import { getCurrentUser } from '../../api/loginApi';

const Dashboard = () => {
  const currentuser = useSelector((state: any) => state.user.user);
  const [dashboards, setDashboards] = useState<DashboardType[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoader] = useState(true);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState<string>('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchUserData = async () => {
    try {
      const params = {
        pageSize: 16,
        page: 0,
      };
      const userData = await getUsers(params);
      dispatch(set_usersCount(userData.data.totalElements));
    } catch (error) {
      console.error('Failed to fetch user data', error);
    }
  };

  const fetchDevices = async (page: number): Promise<void> => {
    try {
      const params: DeviceQueryParams = {
        pageSize: 10,
        page: page,
      };

      const response = await getTenantDevices(params);
      dispatch(set_DeviceCount(response.data.totalElements || 0));
    } catch (error) {
      console.error('Failed to fetch devices', error);
    }
  };

  const fetchAllVehicles = async () => {
    try {
      if (currentuser?.id?.id) {
        const response = await getAllVehiclesByUserId(currentuser.id?.id, undefined);
        dispatch(set_vehicle_count(response.data.totalElements));
      }
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
    }
  };

  const fetchAllWarehouses = async () => {
    try {
      if (currentuser?.id?.id) {
        const response = await getAllWarehouseByUserId(currentuser.id?.id, undefined);
        dispatch(set_warehouse_count(response.data.totalElements));
      }
    } catch (error) {
      console.error('Failed to fetch warehouses:', error);
      dispatch(set_warehouse_count(0));
    }
  };

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
    } catch (error) {
      console.error('Failed to fetch dashboards', error);
      setError('No Dashboard Found');
      setShowError(true);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const response = await getCurrentUser();
        dispatch(set_User(response.data));

        if (response.data?.id?.id) {
          dispatch(set_Authority(response.data.authority));

          await Promise.all([
            fetchDashboards(0),
            fetchUserData(),
            fetchDevices(0),
            fetchAllVehicles(),
            fetchAllWarehouses(),
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch all data:', error);
        setError('Failed to load data');
        setShowError(true);
      } finally {
        setLoader(false);
      }
    };

    fetchAllData();
  }, [dispatch, currentuser?.id?.id]);

  const handleDelete = async (dashboardId: string = '') => {
    try {
      await deleteDashboard(dashboardId);
      setOpen(true);
      fetchDashboards(0);
    } catch (error) {
      console.error('Failed to delete dashboard', error);
    }
  };
  const handleEdit = async (dashboardId: string = '') => {
    navigate(`/dashboard/edit/${dashboardId}`)
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

  const handleAddDashboard = () => {
    // Handle logic to add a new dashboard
    navigate(`/dashboard`);
  };

  return (
    <>
      <div className="menu-data dashboard">
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              Dashboard Management
            </Typography>
            <Button
              color="inherit"
              onClick={handleAddDashboard}
              style={{
                borderRadius: '50%',
                height: '40px', // Adjust the height to your preference
                width: '40px', // Make the width equal to the height
                minWidth: '40px', // Ensure the button is not resized               
              }}
            >
              <AddIcon />
            </Button>
          </Toolbar>
        </AppBar>

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
                      <IconButton aria-label="edit"
                      onClick={()=> handleEdit(dashboard.id?.id)}>
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
