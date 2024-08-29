import { Snackbar, SnackbarCloseReason, SnackbarContent } from '@mui/material';
import Loader from '../Loader/Loader';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import './Dashboards.css';
import { useEffect, useState } from 'react';
import { DashboardQueryParams, DashboardType, Device, DeviceQueryParams, PageData } from '../../types/thingsboardTypes';
import { deleteDashboard, getTenantDashboards } from '../../api/dashboardApi';
import { useDispatch } from 'react-redux';
import { set_DeviceCount, set_usersCount, set_warehouse_count } from '../../Redux/Action/Action';
import { getUsers } from '../../api/userApi';
import { getTenantDevices } from '../../api/deviceApi';

const Dashboard = () => {
  const [dashboards, setDashboards] = useState<DashboardType[]>([]);
  const [loadingDashboards, setLoadingDashboards] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const warecountdispatch = useDispatch();
  const usercountdispatch = useDispatch();
  const deviceCountDispatch = useDispatch();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const params = {
          pageSize: 16,
          page: 0,
        };
        const userData = await getUsers(params);
        usercountdispatch(set_usersCount(userData.data.length));
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

        const response: PageData<Device> = await getTenantDevices(params);
        const devices = response.data || [];
        deviceCountDispatch(set_DeviceCount(devices.length >= 1 ? devices.length : 0));
      } catch (error) {
        console.error('Failed to fetch devices', error);
      }
    };

    fetchUserData();
    fetchDevices(0);
  }, [usercountdispatch, deviceCountDispatch]);

  const fetchAllWarehouses = async () => {
    try {
      const response = await fetch('http://3.111.205.170:2000/warehouse/getallwarehouse');
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      const length = data.length;
      warecountdispatch(set_warehouse_count(length));
    } catch (error) {
      console.error('Failed to fetch warehouses:', error);
    }
  };

  const fetchDashboards = async (page: number) => {
    try {
      setLoadingDashboards(true);
      const params: DashboardQueryParams = {
        pageSize: 10,
        page: page,
        textSearch: '',
        sortProperty: 'title',
        sortOrder: 'ASC',
      };
      const response: PageData<DashboardType> = await getTenantDashboards(params);
      setDashboards(response.data ?? []);
    } catch (error) {
      console.error('Failed to fetch dashboards', error);
    } finally {
      setLoadingDashboards(false);
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
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    fetchDashboards(0);
    fetchAllWarehouses();
  }, []);

  return (
    <>
      <div className="menu-data">
        <div className="devices">
          {loadingDashboards ? (
            <Loader />
          ) : (
            <>
              <h2>Dashboards</h2>
              <ul>
                {dashboards.map((dashboard, index) => (
                  <li key={index}>
                    {dashboard.title}
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
