import React, { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
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
import SettingsIcon from '@mui/icons-material/Settings';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { RootState } from '../../Redux/Reducer';
import { setLayout } from '../../Redux/Action/layoutActions';
import './styles/dashboardheader.css';

interface DashboardHeaderProps {
  onToggleEdit: () => void;
  onAddWidget: () => void;
  isEditable: boolean;
  onSettingClicked: (clicked: any) => any;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onToggleEdit,
  onAddWidget,
  isEditable,
  onSettingClicked
}) => {
  const [selectedRange, setSelectedRange] = useState<string>('last-5-minutes');
  const [openDatePicker, setOpenDatePicker] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  const datePickerRef = useRef<HTMLDivElement>(null);

  const { dashboardId } = useParams<string>();
  const dispatch = useDispatch();

  const storedLayout = useSelector(
    (state: RootState) => state.dashboardLayout[dashboardId || ''] || {}
  );

  const handleRangeChange = (event: any) => {
    const value = event.target.value as string;
    setSelectedRange(value);
    let newDateRange: { startDate: number; endDate: number } | undefined;

    switch (value) {
      case 'last-1-minute':
        newDateRange = { startDate: Date.now() - 60000, endDate: Date.now() };
        break;
      case 'last-5-minutes':
        newDateRange = { startDate: Date.now() - 300000, endDate: Date.now() };
        break;
      case 'last-15-minutes':
        newDateRange = { startDate: Date.now() - 900000, endDate: Date.now() };
        break;
      case 'last-30-minutes':
        newDateRange = { startDate: Date.now() - 1800000, endDate: Date.now() };
        break;
      case 'last-1-hour':
        newDateRange = { startDate: Date.now() - 3600000, endDate: Date.now() };
        break;
      case 'last-2-hours':
        newDateRange = { startDate: Date.now() - 7200000, endDate: Date.now() };
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
      case 'custom-range':
        setOpenDatePicker(true);
        return;
    }

    if (newDateRange) {
      dispatch(
        setLayout(dashboardId, {
          ...storedLayout,
          dateRange: newDateRange
        })
      );
    }
  };

  const handleDateRangeConfirm = () => {
    setOpenDatePicker(false);
    if (startDate && endDate) {
      dispatch(
        setLayout(dashboardId, {
          ...storedLayout,
          dateRange: {
            startDate: startDate.getTime(),
            endDate: endDate.getTime(),
          },
        })
      );
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      datePickerRef.current &&
      !datePickerRef.current.contains(event.target as Node)
    ) {
      setOpenDatePicker(false);
    }
  };

  useEffect(() => {
    if (openDatePicker) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDatePicker]);

  return (
    <>
      <AppBar position="static">
        <Toolbar className="toolbar">
          <Box className="toolbar-left">

          </Box>

          <Box className="toolbar-right">
            <FormControl variant="outlined" className="form-control">
              <InputLabel id="range-label">Range</InputLabel>
              <Select
                labelId="range-label"
                value={selectedRange}
                onChange={handleRangeChange}
                label="Range"
                sx={{
                  color: 'white',
                  backgroundColor: 'transparent',
                  '& .MuiSelect-select': {
                    padding: '10px',
                    color: 'white',
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      border: 'none',
                    },
                    '&:hover fieldset': {
                      border: 'none',
                    },
                    '&.Mui-focused fieldset': {
                      border: 'none',
                    },
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

            <IconButton
              color="inherit"
              onClick={() => onSettingClicked((prev: any) => !prev)}
            >
              <SettingsIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {openDatePicker && (
        <div className="datepicker-dialog" ref={datePickerRef}>
          <div className="datepicker-header">Select Date Range</div>
          <div className="datepicker-body">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date as Date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              dateFormat="MM/dd/yyyy"
            />
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date as Date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              dateFormat="MM/dd/yyyy"
            />
          </div>
          <div className="datepicker-footer">
            <Button variant="outlined" onClick={() => setOpenDatePicker(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleDateRangeConfirm}
            >
              Confirm
            </Button>
          </div>
        </div>
      )}

    </>
  );
};

export default DashboardHeader;
