import React, { useEffect, useState } from 'react';
import {
  TextField,
  Button,
  Box,
  SnackbarContent,
  SnackbarCloseReason,
  Snackbar,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ErrorIcon from '@mui/icons-material/Error';
import { DashboardType } from '../../types/thingsboardTypes';
import { getDashboardById, saveDashboard } from '../../api/dashboardApi';
import { useNavigate, useParams } from 'react-router-dom';
import './AddDashboard.css';  // Ensure you import the CSS file
import { postLayout } from '../../api/MongoAPIInstance';
import CustomSnackBar from '../SnackBar/SnackBar';

const AddDashboard: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');
  const [open, setOpen] = useState(false);
  const [buttonText, setButtonText] = useState('Add Dashboard');

  const navigate = useNavigate();
  const { dashboardId } = useParams();

  useEffect(() => {
    const fetchDashboard = async () => {
      const response = await getDashboardById(dashboardId || '');
      setTitle(response.data?.title || '');
      setDescription(response.data?.description || '');
      setButtonText('Save Dashboard');
    };

    if (dashboardId) {
      fetchDashboard();
    }
  }, [dashboardId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const newDashboard: DashboardType = {
        title,
        description,
      };

      if (dashboardId) {
        const response = await getDashboardById(dashboardId);
        await saveDashboard({ ...response.data, ...newDashboard });
        setMessage('Dashboard updated successfully!');
      } else {
        const response = await saveDashboard(newDashboard);
        const dashboardId = response.data.id.id 
        await postLayout(dashboardId, {
          layout: [],
          dateRange: {
            startDate: null,
            endDate: null,
            range: null
          }
        })
        setMessage('Dashboard created successfully!');
      }
      setSnackbarType('success');
      setOpen(true);

      setTimeout(() => {
        navigate('/dashboards');
      }, 1000);
    } catch (error) {
      console.error('Error saving dashboard:', error);
      setSnackbarType('error');
      setMessage('Failed to create/update dashboard');
      setOpen(true);
    }
  };


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

  const snackbarStyles = {
    backgroundColor: snackbarType === 'success' ? 'green' : 'red',
    color: 'white',
  };

  const snackbarIcon = snackbarType === 'success' ? <CheckIcon /> : <ErrorIcon />;

  return (
    <>
      <div className="dashboard-app-data">
        <Box
          className="add-dashboard menu-data"
          component="form"
          onSubmit={handleSubmit}
        >
          <label htmlFor="" className="label">
            Title
          </label>
          <Box className="text-field-box">
            <TextField
              fullWidth
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Box>

          <label htmlFor="" className="label">
            Description
          </label>
          <Box className="text-field-box">
            <TextField
              fullWidth
              label="Description"
              multiline
              minRows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Box>

          <Box className="accountinfo-savebtn">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className="btn-save-add-dashboard"
            >
              {buttonText}
            </Button>
          </Box>

          {/* <Snackbar
            open={open}
            autoHideDuration={2000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            style={{ marginTop: '64px' }}
          >
            <SnackbarContent
              style={snackbarStyles}
              message={
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  {snackbarIcon}
                  {message}
                </span>
              }
            />
          </Snackbar> */}
        </Box>
      </div>
      <CustomSnackBar open={open} setOpen={setOpen} snackbarType={snackbarType} message={message}/>

    </>
    
  );
};

export default AddDashboard;
