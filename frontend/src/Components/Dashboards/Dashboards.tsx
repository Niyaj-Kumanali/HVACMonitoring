import { Snackbar, SnackbarCloseReason, SnackbarContent } from '@mui/material';
import Loader from '../Loader/Loader';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check'; // Import the CheckIcon
import './Dashboards.css';
import { useEffect, useState } from 'react';
import { DashboardQueryParams, DashboardType, PageData } from '../../types/thingsboardTypes';
import { deleteDashboard, getTenantDashboards } from '../../api/dashboardApi';
import Warehouse from '../Warehouse/Warehouse';
import { useDispatch } from 'react-redux';
import { set_warehouse_count } from '../../Redux/Action/Action';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [dashboards, setDashboards] = useState<DashboardType[]>([]);
  const [loadingDashboards, setLoadingDashboards] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const warecountdispatch = useDispatch();

  const navigate = useNavigate()

  const fetchAllWarehouses = async () => {

    try {
      const response = await fetch('http://3.111.205.170:2000/warehouse/getallwarehouse');
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data: Warehouse[] = await response.json();
      const length = data.length;
      warecountdispatch(set_warehouse_count(length))

    } catch (error) {
      console.error("Failed to fetch warehouses:", error);
    }
  };

  const fetchDashboards = async (page: number) => {
    try {
      setLoadingDashboards(true);

      const params: DashboardQueryParams = {
        pageSize: 10, // Adjust as needed
        page: page,
        textSearch: '', // Adjust as needed or remove if not searching
        sortProperty: 'title', // Adjust as needed or remove if not sorting
        sortOrder: 'ASC', // Adjust as needed or remove if not sorting
      };

      const response: PageData<DashboardType> = await getTenantDashboards(
        params
      );

      setDashboards(response.data ?? []);
    } catch (error) {
      console.error('Failed to fetch dashboards', error);
    } finally {
      setLoadingDashboards(false);
    }
  };

  const handleDelete = async (dashboardId: string = '') => {
    await deleteDashboard(dashboardId)
    setOpen(true);
    fetchDashboards(0)
  }

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    event
    if (reason === 'clickaway') {
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
    fetchDashboards(0);
    fetchAllWarehouses()
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
                  <li key={index} onClick={()=> handleDashboardClick(dashboard.id?.id)}>
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
                Device deleted successfully
              </span>
            }
          />
        </Snackbar>
      </div>
    </>
  );
};

export default Dashboard;
