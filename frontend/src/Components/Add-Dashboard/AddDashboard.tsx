import React, { useEffect, useState } from 'react';
import {
  TextField,
  Button,
  Box,
} from '@mui/material';
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
      try{
        const response = await getDashboardById(dashboardId || '');
        setTitle(response.data?.title || '');
        setDescription(response.data?.description || '');
        setButtonText('Save Dashboard');
      }
      catch(error:any){
        setSnackbarType('error');
        if (error.status === 401) {
          setMessage('Session has expired navigating to login page');
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        }else if (error.status === 404){
          setMessage('Dashboard is not available');
          setTimeout(() => {
            navigate('/dashboards');
          }, 1000);
        }else{
          setMessage('Error fetching dashboard');
          setTimeout(() => {
            navigate('/dashboards');
          }, 1000);
        }
        setOpen(true);
      };

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

      setTimeout(() => {
        navigate('/dashboards');
      }, 1000);
    } catch (error:any) {
      console.error('Error saving dashboard:', error);
      setSnackbarType('error');
      if (error.status === 401) {
        setMessage('Session has expired navigating to login page');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } 
      if(dashboardId) {
        setMessage('Failed to update dashboard');
      }
      else{
        setMessage('Failed to create dashboard');
      }
    }
    finally {
      setOpen(true);
    }
  };






  return (
    <>
      <div className="menu-data">
        <Box
          className="add-dashboard"
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
        </Box>
      </div>
      <CustomSnackBar open={open} setOpen={setOpen} snackbarType={snackbarType} message={message}/>

    </>
    
  );
};

export default AddDashboard;
