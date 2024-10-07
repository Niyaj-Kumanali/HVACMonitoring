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
import { Device, widgetType } from '../../types/thingsboardTypes';
import { getTenantDevices } from '../../api/deviceApi';
import './AddWidget.css'; // Import the CSS file
import { getTimeseriesKeys } from '../../api/telemetryAPIs';

interface AddWidgetProps {
    onAdd: (args: widgetType) => void;
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
    const [thresholds, setThresholds] = useState<{ [key: string]: number }>({});

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
                try {
                    const response = await getTimeseriesKeys(
                        'DEVICE',
                        selectedDevice
                    );
                    setSensors(response.data);
                    setSelectedSensors(response.data);
                    const thresholds: { [key: string]: number } = {};
                    (response.data || []).forEach((key: string) => {
                        thresholds[key] = 0;
                    });
                    setThresholds(thresholds);
                } catch (error) {
                    console.error(error);
                }
            }
        };
        fetchSensors();
    }, [selectedDevice]);

    const handleAdd = () => {
        if (selectedDevice) {
            const body = {
                chart: selectedChart,
                selectedDevice: selectedDevice,
                selectedSensors: selectedSensors,
                thresholds: thresholds,
            };
            onAdd(body); // Pass device ID to onAdd
            // console.log(thresholds)
            onClose(); // Close the dialog after adding
        }
    };

    const handleThresholdChange = (sensor: string, value: number) => {
        const updatedThresholds = { ...thresholds, [sensor]: value };
        setThresholds(updatedThresholds);
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
                            <InputLabel id="device-select-label">
                                Select Device
                            </InputLabel>
                            <Select
                                labelId="device-select-label"
                                value={selectedDevice}
                                onChange={(e) =>
                                    setSelectedDevice(e.target.value as string)
                                }
                                label="Select Device"
                                MenuProps={{
                                    PaperProps: {
                                        className: 'select_dialog_size', // Add your custom class here
                                    },
                                }}
                            >
                                {devices.map((device: Device) => (
                                    <MenuItem
                                        key={device.id?.id}
                                        value={device.id?.id}
                                    >
                                        {device.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl variant="outlined" size="small">
                            <InputLabel id="chart-select-label">
                                Select Chart
                            </InputLabel>
                            <Select
                                labelId="chart-select-label"
                                value={selectedChart}
                                onChange={(e) =>
                                    setSelectedChart(
                                        e.target.value as chartTypes
                                    )
                                }
                                label="Select Chart"
                                MenuProps={{
                                    PaperProps: {
                                        className: 'select_dialog_size', // Add your custom class here
                                    },
                                }}
                            >
                                {charts.map(
                                    (chart: chartTypes, index: number) => (
                                        <MenuItem key={index} value={chart}>
                                            {chart}
                                        </MenuItem>
                                    )
                                )}
                            </Select>
                        </FormControl>
                        <FormControl variant="outlined" size="small">
                            <InputLabel id="sensor-select-label">
                                Select Sensors
                            </InputLabel>
                            <Select
                                labelId="sensor-select-label"
                                multiple
                                value={selectedSensors}
                                onChange={handleSensorChange}
                                renderValue={(selected) =>
                                    (selected as string[]).join(', ')
                                }
                                label="Select Sensors"
                                MenuProps={{
                                    PaperProps: {
                                        className: 'select_dialog_size', // Add your custom class here
                                    },
                                }}
                            >
                                {sensors.map((sensor: string) => (
                                    <MenuItem key={sensor} value={sensor}>
                                        <Checkbox
                                            checked={selectedSensors.includes(
                                                sensor
                                            )}
                                        />
                                        <ListItemText primary={sensor} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl
                            variant="outlined"
                            size="small"
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '5px'
                            }}
                        >
                            {selectedSensors.map((sensor: string) => (
                                <Box
                                    key={sensor}
                                    sx={{
                                        display: 'flex',
                                        gap: '10px',
                                    }}
                                >
                                    {/* Input for setting threshold */}
                                    <TextField
                                        type="number"
                                        size="small"
                                        value={thresholds[sensor] || ''} // Default to 0 if no threshold is set
                                        onChange={(e) =>
                                            handleThresholdChange(
                                                sensor,
                                                Number(e.target.value)
                                            )
                                        }
                                        label={`Threshold for ${sensor}`}
                                    />
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
