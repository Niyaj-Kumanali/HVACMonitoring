import React, { useEffect, useMemo, useState } from 'react';
import './styles/DashboardLayout.css';
import {
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
  Checkbox,
  FormControl,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  Toolbar,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../Redux/Reducer';
import { setLayout } from '../../Redux/Action/layoutActions';
import { charts, chartTypes } from '../Add-Widget/AddWidget';
import { getLayout, postLayout } from '../../api/MongoAPIInstance';
import Chart from './Charts/Chart';

interface WidgetProps {
  widgetId: string;
  deviceId: string;
  chartType: chartTypes;
}

export const DEFAULT_LIMIT = 10000;

const DashboardLayout: React.FC<WidgetProps> = ({
  widgetId,
  deviceId,
  chartType,
}) => {
  const { dashboardId } = useParams(); // Get dashboardId from the URL params
  const dispatch = useDispatch();

  const storedLayout = useSelector(
    (state: RootState) => state.dashboardLayout[dashboardId || ''] || {}
  );
  const currentWidget = storedLayout.layout.map((item: WidgetLayout) =>
    item.i == widgetId ? item : undefined
  )[0];

  const [selectedChart, setSelectedChart] = useState<chartTypes>(
    currentWidget?.chart || chartType
  );
  const [dateRange, setDateRange] = useState(() => {
    const { startDate, endDate, range } = storedLayout?.dateRange || {};
    return {
      startDate: new Date(startDate).getTime() || new Date().getTime() - 300000, // Default to 5 minutes ago
      endDate: new Date(endDate).getTime() || new Date().getTime(), // Default to now
      range: range || 'last-5-minutes', // Default range
    };
  });
  const [selectedDevice, setSelectedDevice] = useState<string>(
    currentWidget?.selectedDevice || deviceId
  );
  const [sensors, setSensors] = useState<string[]>([]);
  const [selectedSensors, setSelectedSensors] = useState<string[]>(
    currentWidget?.selectedSensors || []
  );
  const [telemetryData, setTelemetryData] = useState<TelemetryData>({});
  const [filteredTelemetryData, setFilteredTelemetryData] =
    useState<TelemetryData>({});
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const params = {
          pageSize: 1000000,
          page: 0,
        };
        const response = await getTenantDevices(params);
        setDevices(response.data.data);
      } catch (error) {
        console.error('Failed to fetch devices', error);
      }

      try {
        const response = await getLayout(dashboardId);
        const currentWidget = response.data.layout.map((item: WidgetLayout) =>
          item.i == widgetId ? item : undefined
        )[0];
        if (currentWidget.selectedDevice) {
          setSelectedDevice(currentWidget.selectedDevice || deviceId);
        }
        if (currentWidget.chart) {
          setSelectedChart(currentWidget.chart);
        }
        if (currentWidget.selectedSensors.length > 0) {
          setSelectedSensors(currentWidget.selectedSensors);
        }
        if (
          response.data.dateRange.startDate &&
          response.data.dateRange.endDate &&
          response.data.dateRange.range
        ) {
          setDateRange(response.data?.dateRange);
        }
        dispatch(setLayout(dashboardId, response.data));
      } catch (error: any) {
        console.error('Failed to fetch widget', error);
      }
    };

    fetchInitialData();
  }, [dashboardId, deviceId, dispatch, widgetId]);

  const fetchTimeseriesKeys = async (deviceId: string) => {
    const response = await getTimeseriesKeys('DEVICE', deviceId);
    return response.data;
  };

  useEffect(() => {
    const fetchTelemetryData = async () => {
      if (!selectedDevice) return;

      try {
        const keys = await fetchTimeseriesKeys(selectedDevice);
        setSensors(keys);
        setSelectedSensors((prev) => (prev.length > 0 ? prev : keys));
        const params: TelemetryQueryParams = {
          keys:
            selectedSensors.length > 0
              ? selectedSensors.join(',')
              : keys.join(','),
          startTs: dateRange?.startDate || Date.now() - 300000,
          endTs: dateRange?.endDate || Date.now(),
          limit: storedLayout.limit || DEFAULT_LIMIT,
        };

        const response = await getTimeseries('DEVICE', selectedDevice, params);
        setTelemetryData(response.data);
      } catch (error) {
        console.error('Failed to fetch telemetry data', error);
      }
    };
    fetchTelemetryData();
  }, [selectedDevice, selectedSensors, dateRange.startDate, dateRange.endDate, dateRange.range, storedLayout.limit, storedLayout]);

  useEffect(() => {
    const { startDate, endDate } = storedLayout.dateRange || {};
    if (startDate && endDate) {
      setDateRange(prev => ({
        ...prev,
        startDate: new Date(startDate).getTime(),
        endDate: new Date(endDate).getTime()
      }))
    }
 
    (storedLayout.layout || []).forEach((item: WidgetLayout) => {
      if (item.i === widgetId) {
        setSelectedChart(item?.chart || 'Line');
      }
    });
  }, [storedLayout, widgetId])
 
  
  useEffect(() => {
    const fetchLatestTelemetryData = async () => {
      if (!selectedDevice) return;
      try {
        const keys = await fetchTimeseriesKeys(selectedDevice);
        const response = await getLatestTimeseries(
          'DEVICE',
          deviceId,
          selectedSensors.length > 0 ? selectedSensors : keys
        );
        const latestData = response.data;
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
    };
    const intervalId = setInterval(fetchLatestTelemetryData, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, [deviceId, selectedDevice, selectedSensors, telemetryData]);

  useEffect(() => {
    const data =
      selectedSensors.length > 0
        ? selectedSensors.reduce((acc: any, sensor: string) => {
            const sensorData = telemetryData[sensor] || [];
            acc[sensor] = sensorData.sort((a: any, b: any) => a.ts - b.ts);

            return acc;
          }, {})
        : telemetryData;

    setFilteredTelemetryData(data);
  }, [selectedSensors, storedLayout?.limit, telemetryData]);

  const renderChart = useMemo(() => {
    return (
      <Chart
        data={filteredTelemetryData}
        chartType={selectedChart}
        thresholds={{ temperature: 24, humidity: 50 }}
      />
    );
  }, [filteredTelemetryData, selectedChart]);

  const handleLayoutDelete = async () => {
    const updatedLayout = (storedLayout.layout || []).filter(
      (item) => item.i !== widgetId
    );
    const layoutBody = {
      ...storedLayout,
      layout: updatedLayout,
    };
    dispatch(setLayout(dashboardId, layoutBody));
    await postLayout(dashboardId, layoutBody);
  };

  const handleSensorChange = async (e: { target: { value: string[]; }; }) => {
    const value = e.target.value;
    if (value.length > 0) {
      setSelectedSensors(value);
      try {
        // const response = await getLayout(dashboardId);
        const updatedLayout = storedLayout.layout.map((item: WidgetLayout) =>
          item.i == widgetId ? { ...item, selectedSensors: value } : item
        );
        const layoutBody = {
          ...storedLayout,
          layout: updatedLayout,
        };
        dispatch(setLayout(dashboardId, layoutBody));
        await postLayout(dashboardId, layoutBody);
      } catch (err) {
        console.error('Failed to set sensors', err);
      }
    }
  };

  const handleChartSelection = async (e: { target: { value: chartTypes; }; }) => {
    const value = e.target.value;
    setSelectedChart(value);
    try {
      // const response = await getLayout(dashboardId);
      const updatedLayout = storedLayout.layout.map((item: WidgetLayout) =>
        item.i == widgetId ? { ...item, chart: value } : item
      );
      const layoutBody = {
        ...storedLayout,
        layout: updatedLayout,
      };
      await postLayout(dashboardId, layoutBody);
      dispatch(setLayout(dashboardId, layoutBody));
    } catch (err) {
      console.error('Failed to set sensors', err);
    }
  };

  const handleDeviceSelection = async (e: { target: { value: string; }; }) => {
    const value = e.target.value;
    try {
      setSelectedDevice(value);

      // const response = await getLayout(dashboardId);
      const updatedLayout = storedLayout.layout.map((item: WidgetLayout) =>
        item.i == widgetId ? { ...item, selectedDevice: value } : item
      );
      const layoutBody = {
        ...storedLayout,
        layout: updatedLayout,
      };
      await postLayout(dashboardId, layoutBody);
      dispatch(setLayout(dashboardId, layoutBody));
      console.log(value, ...updatedLayout);
      
    } catch (err) {
      console.error('Failed to set sensors', err);
    }
  };

  return (
    <div className="widget">
      <Toolbar className="widget-header">
        <FormControl variant="standard" size="small">
          <InputLabel id="chart-select-label">Chart</InputLabel>
          <Select
            labelId="chart-select-label"
            value={selectedChart}
            onChange={handleChartSelection}
            label="Chart"
            size="small"
          >
            {charts.map((chart: chartTypes, index: number) => (
              <MenuItem key={index} value={chart}>
                {chart}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant="standard" size="small">
          <InputLabel id="device-select-label">Device</InputLabel>
          <Select
            labelId="device-select-label"
            value={selectedDevice}
            onChange={handleDeviceSelection}
            label="Device"
            size="small"
          >
            {devices.map((device: Device) => (
              <MenuItem key={device.id?.id} value={device.id?.id}>
                {device.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant="standard" size="small">
          <InputLabel size="small" id="sensor-select-label">
            Sensors
          </InputLabel>
          <Select
            labelId="sensor-select-label"
            multiple
            value={selectedSensors}
            onChange={handleSensorChange}
            renderValue={(selected) => (selected as string[]).join(', ')}
            label="Sensors"
            size="small"
          >
            {sensors.map((sensor: string) => (
              <MenuItem key={sensor} value={sensor}>
                <Checkbox checked={selectedSensors.includes(sensor)} />
                <ListItemText primary={sensor} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <IconButton
          onClick={handleLayoutDelete}
          sx={{
            color: 'red',
          }}
        >
          <DeleteIcon />
        </IconButton>
      </Toolbar>
      {renderChart}
    </div>
  );
};

export default DashboardLayout;
