import React from 'react';
import { Select, MenuItem, Button, FormControl, InputLabel, Box, Checkbox, ListItemText } from '@mui/material';

interface HeaderProps {
  devices: { id: string; name: string }[];
  sensors: string[];
  selectedDevice: string;
  selectedSensors: string[];
  onSelectDevice: (deviceId: string) => void;
  onSelectSensors: (sensors: string[]) => void;
  onEdit: () => void;
  onSave: () => void;
}

const DashboardHeader: React.FC<HeaderProps> = ({
  devices,
  sensors,
  selectedDevice,
  selectedSensors,
  onSelectDevice,
  onSelectSensors,
  onEdit,
  onSave,
}) => {

  const renderSelectedSensors = (selected: string[]) => {
    const displayLimit = 1; // Limit number of displayed selected items
    if (selected.length === 0) return <em>Select Sensor</em>;

    if (selected.length > displayLimit) {
      return `${selected.slice(0, displayLimit).join(', ')} + ${selected.length - displayLimit} more`;
    }

    return selected.join(', ');
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      padding="10px"
      bgcolor="#f0f0f0"
    >
      <Box display="flex" gap="16px">
        {/* Devices Dropdown */}
        <FormControl variant="outlined" size="small" style={{ minWidth: 200 }}>
          <InputLabel id="device-select-label">Select Device</InputLabel>
          <Select
            labelId="device-select-label"
            value={selectedDevice}
            onChange={(e) => onSelectDevice(e.target.value)}
            label="Select Device"
          >
            <MenuItem value="">
              <em>Select Device</em>
            </MenuItem>
            {devices.map((device) => (
              <MenuItem key={device.id} value={device.id}>
                {device.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Sensors Dropdown with Multiple Selection */}
        <FormControl variant="outlined" size="small" style={{ minWidth: 200, width: 250}}>
          <InputLabel id="sensor-select-label">Select Sensor</InputLabel>
          <Select
            labelId="sensor-select-label"
            multiple
            value={selectedSensors}
            onChange={(e) => {
              onSelectSensors(e.target.value as string[]);
            }}
            renderValue={(selected) => renderSelectedSensors(selected as string[])}
            label="Select Sensor"
          >
            {sensors.map((sensor, index) => (
              <MenuItem key={index} value={sensor}>
                <Checkbox checked={selectedSensors.includes(sensor)} />
                <ListItemText primary={sensor} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box>
        <Button variant="outlined" color="primary" onClick={onEdit} style={{ marginRight: '8px' }}>
          Edit
        </Button>
        <Button variant="contained" color="primary" onClick={onSave}>
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default DashboardHeader;
