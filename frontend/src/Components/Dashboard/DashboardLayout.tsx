import React, { useEffect, useMemo, useState } from 'react';
import './styles/DashboardLayout.css';
import {
    Device,
    TelemetryData,
    TelemetryQueryParams,
    WidgetLayout,
} from '../../types/thingsboardTypes';
import { getTimeseries, getTimeseriesKeys } from '../../api/telemetryAPIs';
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
import Chart from './Charts/Chart';
import { getLayout, postLayout } from '../../api/dashboardApi';

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
    const currentWidget = storedLayout.layout.find(
        (item: WidgetLayout) => item.i === widgetId
    );

    const [selectedChart, setSelectedChart] = useState<chartTypes>(
        currentWidget?.chart || chartType
    );
    const [selectedDevice, setSelectedDevice] = useState<string>(
        currentWidget?.selectedDevice || deviceId
    );
    const [sensors, setSensors] = useState<string[]>([]);
    const [selectedSensors, setSelectedSensors] = useState<string[]>(
        currentWidget?.selectedSensors || []
    );
    const [telemetryData, setTelemetryData] = useState<TelemetryData>({});
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
                dispatch(setLayout(dashboardId, response.data));
            } catch (error: any) {
                console.error('Failed to fetch widget', error);
            }
        };

        fetchInitialData();
    }, [dashboardId, selectedDevice, dispatch, widgetId]);

    const fetchTimeseriesKeys = async (deviceId: string) => {
        const response = await getTimeseriesKeys('DEVICE', deviceId);
        setSensors(response.data);
        setSelectedSensors((prev) => (prev.length > 0 ? prev : sensors));

        return response.data;
    };

    useEffect(() => {
        const fetchTelemetryData = async () => {
            if (!selectedDevice) return;

            try {
                const keys = await fetchTimeseriesKeys(selectedDevice);
                const params: TelemetryQueryParams = {
                    keys:
                        selectedSensors.length > 0
                            ? selectedSensors.join(',')
                            : keys?.join(','),
                    startTs:
                        storedLayout?.dateRange?.startDate ||
                        Date.now() - 300000,
                    endTs: storedLayout?.dateRange?.endDate || Date.now(),
                    limit: storedLayout.limit || DEFAULT_LIMIT,
                };

                const response = await getTimeseries(
                    'DEVICE',
                    selectedDevice,
                    params
                );

                setTelemetryData(response.data);
            } catch (error) {
                console.error('Failed to fetch telemetry data', error);
                setTelemetryData({});
            }
        };
        fetchTelemetryData();
        // const interval = setInterval(fetchTelemetryData, 1000);
        // return () => {
        //     return clearInterval(interval);
        // };
    }, [
        deviceId,
        selectedDevice,
        selectedSensors,
        storedLayout?.dateRange.startDate,
        storedLayout?.dateRange.endDate,
        storedLayout?.dateRange.range,
        storedLayout?.limit,
        storedLayout,
    ]);

    const filteredTelemetryData = useMemo(() => {
        return selectedSensors.length > 0
            ? selectedSensors.reduce((acc: any, sensor: string) => {
                  const sensorData = telemetryData[sensor] || [];
                  acc[sensor] = sensorData.sort(
                      (a: any, b: any) => a.ts - b.ts
                  );

                  return acc;
              }, {})
            : telemetryData;
    }, [selectedSensors, storedLayout?.limit, telemetryData]);

    const renderChart = useMemo(() => {
        return (
            <Chart
                data={filteredTelemetryData}
                chartType={selectedChart}
                thresholds={currentWidget?.thresholds}
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

    const handleSensorChange = async (e: any) => {
        const value = e.target.value;
        if (value.length > 0) {
            setSelectedSensors(value);
            try {
                const updatedLayout = storedLayout.layout.map(
                    (item: WidgetLayout) =>
                        item.i == widgetId
                            ? { ...item, selectedSensors: value }
                            : item
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

    const handleChartSelection = async (e: any) => {
        const value = e.target.value;
        setSelectedChart(value);
        try {
            const updatedLayout = storedLayout.layout.map(
                (item: WidgetLayout) =>
                    item.i == widgetId ? { ...item, chart: value } : item
            );
            const layoutBody = {
                ...storedLayout,
                layout: updatedLayout,
            };
            await postLayout(dashboardId, layoutBody);
            dispatch(setLayout(dashboardId, layoutBody));
        } catch (err) {
            console.error('Failed to set chart', err);
        }
    };

    const handleDeviceSelection = async (e: any) => {
        const value = e.target.value;
        try {
            setSelectedSensors([]);
            setSelectedDevice(value);

            const updatedLayout = storedLayout.layout.map(
                (item: WidgetLayout) =>
                    item.i == widgetId
                        ? {
                              ...item,
                              selectedDevice: value,
                              selectedSensors: [],
                          }
                        : item
            );
            const layoutBody = {
                ...storedLayout,
                layout: updatedLayout,
            };
            await postLayout(dashboardId, layoutBody);
            dispatch(setLayout(dashboardId, layoutBody));
        } catch (err) {
            console.error('Failed to set Device', err);
        }
    };

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxSizing: 'border-box',
            }}
        >
            <Toolbar
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    width: '100%',
                    height: '15%',
                    gap: '5px',
                }}
            >
                <FormControl variant="standard" size="small">
                    <InputLabel id="chart-select-label">Chart</InputLabel>
                    <Select
                        labelId="chart-select-label"
                        value={selectedChart}
                        onChange={handleChartSelection}
                        label="Chart"
                        size="small"
                        sx={{
                            width: '50px',
                        }}
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
                        sx={{
                            width: '70px',
                        }}
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
                        renderValue={(selected) =>
                            (selected as string[]).join(', ')
                        }
                        label="Sensors"
                        size="small"
                    >
                        {sensors.map((sensor: string) => (
                            <MenuItem key={sensor} value={sensor}>
                                <Checkbox
                                    checked={selectedSensors.includes(sensor)}
                                />
                                <ListItemText primary={sensor} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <IconButton
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent drag/resize events from interfering
                        handleLayoutDelete();
                    }}
                    sx={{
                        color: 'red',
                        zIndex: '20000',
                    }}
                >
                    <DeleteIcon />
                </IconButton>
            </Toolbar>
            {renderChart}
        </div>
    );
};

export default React.memo(DashboardLayout);
