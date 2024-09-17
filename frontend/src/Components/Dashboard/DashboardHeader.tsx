import React, { useState} from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { RootState } from '../../Redux/Reducer';
import { setLayout } from '../../Redux/Action/layoutActions';
import './styles/dashboardheader.css';
import { uuid } from '../../Utility/utility_functions';
import { CheckCircleOutline } from '@mui/icons-material';

interface DashboardHeaderProps {
  onToggleEdit: () => void;
  onAddWidget: () => void;
  isEditable: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onToggleEdit,
  onAddWidget,
  isEditable,
}) => {
  const [selectedRange, setSelectedRange] = useState<string>('last-5-minutes');
  const [openDatePicker, setOpenDatePicker] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<number>(
    new Date().getTime() - 60000
  );
  const [endDate, setEndDate] = useState<number>(new Date().getTime());


  const { dashboardId } = useParams<string>();
  const dispatch = useDispatch();
  const storedLayout = useSelector(
    (state: RootState) => state.dashboardLayout[dashboardId || '']
  );

  console.log("first")

  const handleRangeChange = (event: any) => {
    console.log(event.target.value, openDatePicker);
    const value = event.target.value as string;

    if (value === selectedRange && value === 'custom-range') {
      // Temporarily reset to force re-triggering the onChange event
      setSelectedRange('');
      setTimeout(() => setSelectedRange('custom-range'), 0);
      setOpenDatePicker(true); // Reopen the date picker
      return;
    }

    setSelectedRange(value);

    if (value === 'custom-range') {
      setOpenDatePicker(true);
    } else {
      setOpenDatePicker(false);
      let newDateRange: { startDate: number; endDate: number } | undefined;

      switch (value) {
        case 'last-1-minute':
          newDateRange = { startDate: Date.now() - 60000, endDate: Date.now() };
          break;
        case 'last-5-minutes':
          newDateRange = {
            startDate: Date.now() - 300000,
            endDate: Date.now(),
          };
          break;
        case 'last-15-minutes':
          newDateRange = {
            startDate: Date.now() - 900000,
            endDate: Date.now(),
          };
          break;
        case 'last-30-minutes':
          newDateRange = {
            startDate: Date.now() - 1800000,
            endDate: Date.now(),
          };
          break;
        case 'last-1-hour':
          newDateRange = {
            startDate: Date.now() - 3600000,
            endDate: Date.now(),
          };
          break;
        case 'last-2-hours':
          newDateRange = {
            startDate: Date.now() - 7200000,
            endDate: Date.now(),
          };
          break;
        case 'last-1-day':
          newDateRange = {
            startDate: Date.now() - 86400000,
            endDate: Date.now(),
          };
          break;
        case 'last-7-days':
          newDateRange = {
            startDate: Date.now() - 604800000,
            endDate: Date.now(),
          };
          break;
        case 'last-30-days':
          newDateRange = {
            startDate: Date.now() - 2592000000,
            endDate: Date.now(),
          };
          break;
      }

      if (newDateRange) {
        dispatch(
          setLayout(dashboardId, {
            ...storedLayout,
            dateRange: newDateRange,
          })
        );
        
      }
    }
  };

  const handleDateRangeConfirm = () => {
    // setOpenDatePicker(false);
    if (startDate && endDate) {
      dispatch(
        setLayout(dashboardId, {
          ...storedLayout,
          dateRange: {
            startDate: startDate,
            endDate: endDate,
          },
        })
      );
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar
          style={{ backgroundColor: '#2BC790', height: '6vh' }}
          className="toolbar"
        >
          <Box className="toolbar-left"></Box>

          <Box className="toolbar-right">
            {openDatePicker && (
              <div className="date-fields">
                <div className="input-container">
                  <label htmlFor="date-start">Start Date</label>
                  <input
                    type="date"
                    id="date-start"
                    className="date-field"
                    value={
                      new Date(startDate)?.toISOString().split('T')[0] || ''
                    }
                    onChange={(e) =>
                      setStartDate(new Date(e.target.value).getTime())
                    }
                  />
                </div>
                <div className="input-container">
                  <label htmlFor="date-end">End Date</label>
                  <input
                    type="date"
                    id="date-end"
                    className="date-field"
                    value={new Date(endDate)?.toISOString().split('T')[0] || ''}
                    onChange={(e) =>
                      setEndDate(new Date(e.target.value).getTime())
                    }
                  />
                </div>
                <IconButton>
                  <CheckCircleOutline sx={{color: 'white'}} onClick={handleDateRangeConfirm} />
                </IconButton>
              </div>
            )}
            <FormControl
              variant="outlined"
              className="form-control"
              size="small"
              sx={{
                background: 'transparent',
              }}
            >
              <InputLabel
                id="realtime-label"
                sx={{
                  color: 'white',
                  '&.Mui-focused': {
                    color: 'white',
                  },
                  '&:hover': {
                    color: 'blue',
                  },
                }}
              >
                Realtime
              </InputLabel>
              <Select
                key={uuid()}
                labelId="realtime-label"
                value={selectedRange}
                onChange={handleRangeChange}
                label="Realtime"
                sx={{
                  color: 'white',
                  '&.Mui-focused': {
                    color: 'white',
                  },
                  '&:hover': {
                    color: 'blue',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'white',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'white',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'blue',
                  },
                }}
              >
                <MenuItem value="last-1-minute">Last 1 Minute</MenuItem>
                <MenuItem value="last-5-minutes">Last 5 Minutes</MenuItem>
                <MenuItem value="last-15-minutes">Last 15 Minutes</MenuItem>
                <MenuItem value="last-30-minutes">Last 30 Minutes</MenuItem>
                <MenuItem value="last-1-hour">Last 1 Hour</MenuItem>
                <MenuItem value="last-2-hours">Last 2 Hours</MenuItem>
                <MenuItem value="last-1-day">Last 1 Day</MenuItem>
                <MenuItem value="last-7-days">Last 7 Days</MenuItem>
                <MenuItem value="last-30-days">Last 30 Days</MenuItem>
                <MenuItem value="custom-range">Custom Range</MenuItem>
              </Select>
            </FormControl>

            {isEditable && (
              <IconButton color="inherit" onClick={onAddWidget}>
                <AddIcon />
              </IconButton>
            )}

            <Button
              color="inherit"
              startIcon={isEditable ? <SaveIcon /> : <EditIcon />}
              onClick={onToggleEdit}
            >
              {isEditable ? 'Save' : 'Edit'}
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default DashboardHeader;
