import React, { useEffect, useMemo, useState } from 'react';
import './styles/DashboardLayout.css';
import {
  chartTypes,
  Device,
  TelemetryData,
  TelemetryQueryParams,
  WidgetLayout,
} from '../../types/thingsboardTypes';
import {
  getLatestTimeseries,
  getTimeseries,
  getTimeseriesKeys,
} from '../../api/telemetryAPIs';
import { getTenantDevices } from '../../api/deviceApi';
import {
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  Toolbar,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import LineChartWidget from './Charts/LineChartWidget';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../Redux/Reducer';
import { setLayout } from '../../Redux/Action/layoutActions';
import { charts } from '../Add-Widget/AddWidget';
import { postLayout } from '../../api/MongoAPIInstance';

interface WidgetProps {
  widgetId: string;
  deviceId: string;
  chartType: chartTypes;
}

const DashboardLayout: React.FC<WidgetProps> = ({ widgetId, deviceId, chartType }) => {
  const { dashboardId } = useParams(); // Get dashboardId from the URL params
  const dispatch = useDispatch();

  const storedLayout = useSelector(
    (state: RootState) => state.dashboardLayout[dashboardId || ''] || {}
  );

  const [selectedChart, setSelectedChart] = useState<chartTypes>(chartType);
  const [startDate, setStartDate] = useState<number>(Date.now() - 300000); // Default last 5 minutes
  const [endDate, setEndDate] = useState<number>(Date.now());
  const [selectedDevice, setSelectedDevice] = useState<string>(deviceId);
  const [sensors, setSensors] = useState<string[]>([]);
  const [selectedSensors, setSelectedSensors] = useState<string[]>([]);
  const [telemetryData, setTelemetryData] = useState<TelemetryData>({});
  const [filteredTelemetryData, setFilteredTelemetryData] =
    useState<TelemetryData>({});
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    const { startDate: layoutStartDate, endDate: layoutEndDate } =
      storedLayout.dateRange || {};
    if (layoutStartDate && layoutEndDate) {
      setStartDate(layoutStartDate);
      setEndDate(layoutEndDate);
    }

    (storedLayout.layout || []).forEach((item: WidgetLayout) => {
      if (item.i === widgetId) {
        setSelectedChart(item?.chart || 'Line');
      }
    });
  }, [storedLayout, widgetId]);

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
      startTs: startDate || Date.now() - 300000,
      endTs: endDate || Date.now(),
      limit: storedLayout.limit || 100,
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
      setDevices(response.data.data);
    };

    fetchAllDevices();
  }, []);

  useEffect(() => {
    const fetchTelemetryData = async () => {
      if (!selectedDevice) return;

      try {
        const keys = await fetchTimeseriesKeys(selectedDevice);
        setSensors(keys);
        setSelectedSensors((prev) => (prev.length > 0 ? prev : keys));

        const telemetryData = await fetchTimeseriesData(
          selectedDevice,
          selectedSensors,
          keys
        );
        setTelemetryData(telemetryData);
      } catch (error) {
        console.error('Failed to fetch telemetry data', error);
        setSensors([]);
        setSelectedSensors([]);
      }
    };

    fetchTelemetryData();
  }, [selectedDevice, selectedSensors, startDate, endDate, storedLayout.limit]);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      if (!selectedDevice) return;

      try {
        const keys = await fetchTimeseriesKeys(selectedDevice);
        const latestData = await fetchLatestTelemetryData(
          selectedDevice,
          selectedSensors,
          keys
        );
        const updatedTelemetryData = Object.keys(latestData).reduce(
          (acc, key) => {
            return {
              ...acc,
              [key]: [...(telemetryData[key] || []), ...latestData[key]],
            };
          },
          telemetryData
        );

        setTelemetryData(updatedTelemetryData);
      } catch (error) {
        console.error('Failed to fetch latest telemetry data', error);
      }
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [selectedDevice, selectedSensors, telemetryData]);

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
    return (
      <LineChartWidget data={filteredTelemetryData} chartType={selectedChart} />
    );
  }, [filteredTelemetryData, selectedChart]);

  const handleLayoutDelete = async () => {
    const updatedLayout = (storedLayout.layout || []).filter(
      (item) => item.i !== widgetId
    );
    if (updatedLayout.length !== storedLayout.layout?.length) {
      dispatch(
        setLayout(dashboardId, {
          ...storedLayout,
          layout: updatedLayout,
        })
      );

      await postLayout(dashboardId, {
        ...storedLayout,
        layout: updatedLayout,
      });
    }
  };

  return (
    <div className="widget">
      <Toolbar className="widget-header">
        <FormControl variant="outlined" size="small" style={{ minWidth: 100 }}>
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
            onChange={(e) => {
              const value = e.target.value as string[];
              if (value.length > 0) {
                setSelectedSensors(value);
              }
            }}
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
        <Button className="delete-button" onClick={handleLayoutDelete}>
          <DeleteIcon />
        </Button>
      </Toolbar>
      {renderChart}
    </div>
  );
};

export default DashboardLayout;