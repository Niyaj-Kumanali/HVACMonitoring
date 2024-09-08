import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  CircularProgress,
  Typography,
} from '@mui/material';
import { chartTypes, Device } from '../../types/thingsboardTypes';
import { getTenantDevices } from '../../api/deviceApi';
import './AddWidget.css';  // Import the CSS file

interface AddWidgetProps {
  onAdd: (deviceName: string, chart: chartTypes) => void;
  onClose: () => void;
}

const charts: chartTypes[] = ['Line', 'Bar', 'Area'];

const AddWidget: React.FC<AddWidgetProps> = ({ onAdd, onClose }) => {
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [selectedChart, setSelectedChart] = useState<chartTypes>('Line');
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllDevices = async () => {
      try {
        const params = { pageSize: 1000000, page: 0 };
        const response = await getTenantDevices(params);
        setDevices(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load devices.');
        setLoading(false);
      }
    };

    fetchAllDevices();
  }, []);

  const handleAdd = () => {
    if (selectedDevice) {
      onAdd(selectedDevice, selectedChart); // Pass device ID to onAdd
      onClose(); // Close the dialog after adding
    }
  };

  return (
    <Dialog open onClose={onClose} className="add-widget-dialog menu-data">
      <DialogTitle>Add New Widget</DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <>
            <FormControl variant="outlined" size="small">
              <InputLabel id="device-select-label">Select Device</InputLabel>
              <Select
                labelId="device-select-label"
                value={selectedDevice}
                onChange={(e) => setSelectedDevice(e.target.value as string)}
                label="Select Device"
              >
                {devices.map((device: Device) => (
                  <MenuItem key={device.id?.id} value={device.id?.id}>
                    {device.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl variant="outlined" size="small">
              <InputLabel id="chart-select-label">Select Chart</InputLabel>
              <Select
                labelId="chart-select-label"
                value={selectedChart}
                onChange={(e) => setSelectedChart(e.target.value as chartTypes)}
                label="Select Chart"
              >
                {charts.map((chart: chartTypes, index: number) => (
                  <MenuItem key={index} value={chart}>
                    {chart}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleAdd} variant="contained" color="primary" disabled={!selectedDevice}>
          Add Widget
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddWidget;
