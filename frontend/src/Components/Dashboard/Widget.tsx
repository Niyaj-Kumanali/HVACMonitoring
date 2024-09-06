import React, { useEffect, useMemo, useState } from 'react';
import './Dashboard.css';
import {
  Device,
  TelemetryData,
  TelemetryQueryParams,
} from '../../types/thingsboardTypes';
import {
  getLatestTimeseries,
  getTimeseries,
  getTimeseriesKeys,
} from '../../api/telemetryAPIs';
import { getTenantDevices } from '../../api/deviceApi';
import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  Toolbar,
} from '@mui/material';
import LineChartWidget from './Charts/LineChartWidget';

const Widget: React.FC = () => {
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [sensors, setSensors] = useState<string[]>([]);
  const [selectedSensors, setSelectedSensors] = useState<string[]>([]);
  const [telemetryData, setTelemetryData] = useState<TelemetryData>({});
  const [filteredTelemetryData, setFilteredTelemetryData] =
    useState<TelemetryData>({});
  const [devices, setdevices] = useState([]);

  const fetchTimeseriesKeys = async (deviceId: string) => {
    const response = await getTimeseriesKeys('DEVICE', deviceId);
    return response.data;
  };

  const fetchTimeseriesData = async (
    deviceId: string,
    selectedSensors: string[],
    sensors: string[]
  ) => {
    const params: TelemetryQueryParams = {
      keys:
        selectedSensors.length > 0
          ? selectedSensors.join(',')
          : sensors.join(','),
      startTs: Date.now() - 3600000, // last hour
      endTs: Date.now(),
      limit: 100,
      orderBy: 'ASC',
    };

    const response = await getTimeseries('DEVICE', deviceId, params);
    return response.data;
  };

  const fetchLatestTelemetryData = async (
    deviceId: string,
    selectedSensors: string[],
    sensors: string[]
  ) => {
    const response = await getLatestTimeseries(
      'DEVICE',
      deviceId,
      selectedSensors.length > 0 ? selectedSensors : sensors
    );
    return response.data;
  };

  useEffect(() => {
    const fetchAllDevices = async () => {
      const params = {
        pageSize: 1000000,
        page: 0,
      };
      const response = await getTenantDevices(params);
      setdevices(response.data.data);
    };

    fetchAllDevices();
  }, []);

  useEffect(() => {
    const fetchTelemetryData = async () => {
      try {
        if (!selectedDevice) return;


        const keys = await fetchTimeseriesKeys(selectedDevice);
        setSensors(keys);
        setSelectedSensors((prev) => (prev.length > 0 ? prev : keys));

        const telemetryData = await fetchTimeseriesData(
          selectedDevice,
          selectedSensors,
          keys
        );

        setTelemetryData(telemetryData);

        const intervalId = setInterval(async () => {
          const latestData = await fetchLatestTelemetryData(
            selectedDevice,
            selectedSensors,
            keys
          );
          const latestTelemetryData = latestData;

          // Merge latestTelemetryData with existing telemetryData
          const updatedTelemetryData = Object.keys(latestTelemetryData).reduce(
            (acc, key) => {
              return {
                ...acc,
                [key]: [
                  ...(telemetryData[key] || []),
                  ...latestTelemetryData[key],
                ],
              };
            },
            telemetryData
          );

          setTelemetryData(updatedTelemetryData);
        }, 5000);

        // Clean up the interval on component unmount or if selectedDevice changes
        return () => {
          console.log('Interval cleared');
          return clearInterval(intervalId);
        };
      } catch (error) {
        console.log('Failed to fetch telemetry data', error);
        setSensors([]);
        setSelectedSensors([]);
      }
    };

    fetchTelemetryData();
  }, [selectedDevice, selectedSensors]);

  useEffect(() => {
    const data =
      selectedSensors.length > 0
        ? selectedSensors.reduce((acc: any, sensor: string) => {
            acc[sensor] = telemetryData[sensor] || [];
            return acc;
          }, {})
        : telemetryData;

    setFilteredTelemetryData(data);
  }, [selectedSensors, telemetryData]);

  const renderChart = useMemo(() => {
    console.log(filteredTelemetryData);
    return <LineChartWidget data={filteredTelemetryData} />;
  }, [filteredTelemetryData]);

  return (
    <div className="widget">
      <Toolbar className="widget-header">
        <FormControl variant="outlined" size="small" style={{ minWidth: 100 }}>
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
        <FormControl variant="outlined" size="small" style={{ width: 200 }}>
          <InputLabel id="sensor-select-label">Select Sensors</InputLabel>
          <Select
            labelId="sensor-select-label"
            multiple
            value={selectedSensors}
            onChange={(e) => setSelectedSensors(e.target.value as string[])}
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
      </Toolbar>
      {renderChart}
    </div>
  );
};

export default Widget;
