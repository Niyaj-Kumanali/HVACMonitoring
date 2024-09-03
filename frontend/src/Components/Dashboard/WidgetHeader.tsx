// WidgetHeader.tsx
import React, { useEffect, useState } from 'react';
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  ListItemText,
} from '@mui/material';
import { Device } from '../../types/thingsboardTypes';
import { getDeviceById } from '../../api/deviceApi';

interface WidgetHeaderProps {
  devices: Device[];
  selectedDevice: string;
  selectedSensors: string[];
  onSelectDevice: (deviceId: string) => void;
  onSelectSensors: (sensors: string[]) => void;
}

const WidgetHeader: React.FC<WidgetHeaderProps> = ({
  devices,
  selectedDevice,
  selectedSensors,
  onSelectDevice,
  onSelectSensors,
}) => {
const [device, setDevice] = useState<Device>({})

  useEffect(()=> {
    const getDevice = async()=> {
        const response = await getDeviceById(selectedDevice)
        setDevice(response.data)
    }
    getDevice()
  }, [selectedDevice])

  return (
    <div className="widget-header">
      {/* Device Selection */}
      <FormControl variant="outlined" size="small" style={{ minWidth: 200 }}>
        <InputLabel id="device-select-label">Select Device</InputLabel>
        <Select
          labelId="device-select-label"
          value={selectedDevice}
          onChange={(e) => onSelectDevice(e.target.value as string)}
          label="Select Device"
        >
          {devices.map((device: Device) => (
            <MenuItem key={device.id?.id} value={device.id?.id}>
              {device.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Sensors Selection */}
      <FormControl variant="outlined" size="small" style={{ minWidth: 200, marginLeft: 16 }}>
        <InputLabel id="sensor-select-label">Select Sensors</InputLabel>
        <Select
          labelId="sensor-select-label"
          multiple
          value={selectedSensors}
          onChange={(e) => onSelectSensors(e.target.value as string[])}
          renderValue={(selected) => (selected as string[]).join(', ')}
          label="Select Sensors"
        >
          {selectedSensors.map((sensor) => (
            <MenuItem key={sensor} value={sensor}>
              <Checkbox checked={selectedSensors.includes(sensor)} />
              <ListItemText primary={sensor} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default WidgetHeader;
