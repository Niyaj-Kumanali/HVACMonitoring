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

import { Device } from '../../types/thingsboardTypes';
import { getTenantDevices } from '../../api/deviceApi';

interface AddWidgetProps {
  onAdd: (deviceName: string) => void;
  onClose: () => void;
}

const AddWidget: React.FC<AddWidgetProps> = ({ onAdd, onClose }) => {
  const [selectedDevice, setSelectedDevice] = useState<string>('');
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
      onAdd(selectedDevice); // Pass device ID to onAdd
      onClose(); // Close the dialog after adding
    }
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>Add New Widget</DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <FormControl variant="outlined" size="small" style={{ minWidth: 200 }}>
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
