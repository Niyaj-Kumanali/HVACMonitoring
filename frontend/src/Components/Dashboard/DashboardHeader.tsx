// src/components/DashboardHeader.tsx
import React, { useEffect, useState } from 'react';
import { Select, MenuItem, Button, FormControl, InputLabel, Box } from '@mui/material';
import { getTimeseriesKeys } from '../../api/deviceProfileAPIs';

interface HeaderProps {
  devices: { id: string; name: string }[];
  sensors: string[]; // Added sensors prop
  selectedDevice: string;
  selectedSensor: string; // Added selectedSensor prop
  onSelectDevice: (deviceId: string) => void;
  onSelectSensor: (sensorId: string) => void; // Added onSelectSensor prop
  onEdit: () => void;
  onSave: () => void;
}

const DashboardHeader: React.FC<HeaderProps> = ({
  devices,
  sensors,
  selectedDevice,
  selectedSensor,
  onSelectDevice,
  onSelectSensor,
  onEdit,
  onSave,
}) => {
  
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

        {/* Sensors Dropdown */}
        <FormControl variant="outlined" size="small" style={{ minWidth: 200 }}>
          <InputLabel id="sensor-select-label">Select Sensor</InputLabel>
          <Select
            labelId="sensor-select-label"
            value={selectedSensor}
            onChange={(e) => onSelectSensor(e.target.value)}
            label="Select Sensor"
          >
            <MenuItem value="">
              <em>Select Sensor</em>
            </MenuItem>
            {sensors.map((sensor, index) => (
              <MenuItem key={index} value={sensor}>
                {sensor}
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
