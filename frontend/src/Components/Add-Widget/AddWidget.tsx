/* eslint-disable react-refresh/only-export-components */
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
  Checkbox,
  ListItemText,
  TextField,
  Box,
} from '@mui/material';
import { Device } from '../../types/thingsboardTypes';
import { getTenantDevices } from '../../api/deviceApi';
import './AddWidget.css'; // Import the CSS file
import { getTimeseriesKeys } from '../../api/telemetryAPIs';

interface AddWidgetProps {
  onAdd: (deviceName: string, chart: chartTypes, selectedSensors: string[]) => void;
  onClose: () => void;
}

export type chartTypes = 'Line' | 'Bar' | 'Area' | 'Composed' | 'Scatter';
export const charts: chartTypes[] = ['Line', 'Bar', 'Area', 'Scatter'];

const AddWidget: React.FC<AddWidgetProps> = ({ onAdd, onClose }) => {
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [selectedChart, setSelectedChart] = useState<chartTypes>('Line');
  const [selectedSensors, setSelectedSensors] = useState<string[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [sensors, setSensors] = useState<string[]>([]);
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

  useEffect(() => {
    const fetchSensors = async () => {
      if (selectedDevice && selectedDevice != '') {
        const response = await getTimeseriesKeys('DEVICE', selectedDevice);
        setSensors(response.data);
        setSelectedSensors(response.data);
      }
    };
    fetchSensors();
  }, [selectedDevice]);

  const handleAdd = () => {
    if (selectedDevice) {
      onAdd(selectedDevice, selectedChart, selectedSensors); // Pass device ID to onAdd
      onClose(); // Close the dialog after adding
    }
  };

  const handleSensorChange = async (e: any) => {
    const value = e.target.value as string[];
    if (value.length > 0) {
      setSelectedSensors(value);
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
          <div className="add-widget-box">
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
            <FormControl variant="outlined" size="small">
              <InputLabel id="sensor-select-label">Select Sensors</InputLabel>
              <Select
                labelId="sensor-select-label"
                multiple
                value={selectedSensors}
                onChange={handleSensorChange}
                renderValue={(selected) => (selected as string[]).join(', ')}
                label="Select Sensors"
              >
                {sensors.map((sensor: string) => (
                  <MenuItem key={sensor} value={sensor}>
                    <Checkbox checked={selectedSensors.includes(sensor)} />
                    <ListItemText primary={sensor} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl variant="outlined" size="small">
              {selectedSensors.map((sensor: string) => (
                <Box sx={{display: 'flex', gap: '10px'}}>
                  <TextField type='text' size='small' value={sensor} disabled />
                  <TextField type='number' size='small' value={0} />
                </Box>
              ))}
            </FormControl>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleAdd}
          variant="contained"
          color="primary"
          disabled={!selectedDevice}
        >
          Add Widget
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddWidget;
