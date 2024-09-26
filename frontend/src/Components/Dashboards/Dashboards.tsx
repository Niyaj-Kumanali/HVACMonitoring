import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
} from '@mui/material';
import Loader from '../Loader/Loader';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
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
import {
  deleteLayout,
  getAllVehiclesByUserId,
  getAllWarehouseByUserId,
} from '../../api/MongoAPIInstance';
import { getCurrentUser } from '../../api/loginApi';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import Paginations from '../Pagination/Paginations';
import CustomSnackBar from '../SnackBar/SnackBar';
import { RootState } from '../../Redux/Reducer';

const Dashboards = () => {
  const currentuser = useSelector((state: RootState) => state.user.user);
  const [dashboards, setDashboards] = useState<DashboardType[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoader] = useState(false);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState<string>('');
  const [pageCount, setPageCount] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
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
        const response = await getAllVehiclesByUserId(
          currentuser.id?.id,
          undefined
        );
        dispatch(set_vehicle_count(response.data.totalElements));
      }
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
    }
  };

  const fetchAllWarehouses = async () => {
    try {
      if (currentuser?.id?.id) {
        const response = await getAllWarehouseByUserId(
          currentuser.id?.id,
          undefined
        );
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
        pageSize: 12,
        page: page,
        sortProperty: 'title',
        sortOrder: 'ASC',
      };
      const response = await getTenantDashboards(params);
      setDashboards(response.data.data ?? []);
      setPageCount(response.data.totalPages);
    } catch (error) {
      console.error('Failed to fetch dashboards', error);
      setError('No Dashboard Found');
      setShowError(true);
    }
  };

  useEffect(() => {
    setLoader(true);
    const fetchAllData = async () => {
      try {
        const response = await getCurrentUser();
        dispatch(set_User(response.data));

        if (response.data?.id?.id) {
          dispatch(set_Authority(response.data.authority));

          await Promise.all([
            fetchDashboards(currentPage - 1),
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
        setTimeout(() => {
          setLoader(false);
        }, 700);
      }
    };

    fetchAllData();
  }, [dispatch, currentuser?.id?.id, currentPage]);

  const handleDelete = async (dashboardId: string = '') => {
    try {
      await deleteDashboard(dashboardId);
      setOpen(true);
      fetchDashboards(currentPage - 1);

      await deleteLayout(dashboardId);
    } catch (error) {
      console.error('Failed to delete dashboard', error);
    }
  };
  const handleEdit = async (dashboardId: string = '') => {
    navigate(`/dashboard/edit/${dashboardId}`);
  };

  const handleDashboardClick = (dashboardId: string = 'defaultId') => {
    if (dashboardId) {
      navigate(`/dashboard/${dashboardId}`);
    }
  };

  const handleAddDashboard = () => {
    navigate(`/dashboard`);
  };

  return (
    <>
      <div className="menu-data">
        <AppBar
          style={{ backgroundColor: '#2BC790' }}
          position="static"
          className="app-bar-dashboard"
        >
          <Toolbar>
            <Typography
              variant="h6"
              style={{ flexGrow: 1 }}
              className="typography"
            >
              Dashboard Management
            </Typography>
            <Button
              color="inherit"
              onClick={handleAddDashboard}
              style={{
                borderRadius: '50%',
                height: '40px',
                width: '40px',
                minWidth: '40px',
              }}
            >
              <AddIcon />
            </Button>
          </Toolbar>
        </AppBar>

        <div className="dashboards">
          {loading ? (
            <Loader />
          ) : showError ? (
            <div>{error}</div>
          ) : (
            <>
              <ul>
                <div className="dashboard-cont">
                  {dashboards.map((dashboard, index) => (
                    <li key={index} className="dashboardListItem">
                      <span
                        onClick={() => handleDashboardClick(dashboard.id?.id)}
                        className="title"
                      >
                        {dashboard.title}
                      </span>
                      <div className="button-container">
                        <IconButton
                          aria-label="edit"
                          onClick={() => handleEdit(dashboard.id?.id)}
                        >
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
                </div>
              </ul>
              <Paginations
                pageCount={pageCount}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      </div>
      <CustomSnackBar
        open={open}
        setOpen={setOpen}
        snackbarType={'success'}
        message={'Dashboard deleted successfully'}
      />
    </>
  );
};

export default Dashboards;
