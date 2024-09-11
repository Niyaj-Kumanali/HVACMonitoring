import { useEffect, useState } from "react";
import {
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    Checkbox,
    FormControlLabel
} from "@mui/material";
import { getAllWarehouseByUserId } from "../../api/MongoAPIInstance";
import { getFilteredDevices } from "../../api/deviceApi";
import {  getTimeseries, getTimeseriesKeys } from "../../api/telemetryAPIs";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useTheme } from '@mui/material/styles';
import { LineChart } from '@mui/x-charts/LineChart';
import "./Charts.css";
import Loader from "../Loader/Loader";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/Reducer";

interface Warehouse {
    warehouse_id: string;
    warehouse_name: string;
}

interface Device {
    name: string;
    category: string;
    status: string;
    lastUpdated: string;
    id: {
        id: string;
    };
    active: boolean;
    createdTime: number;
}

interface TelemetryData {
    ts: number[];
    value: number[];
}


const Charts = () => {
    const currentUser = useSelector((state: RootState) => state.user.user)
    const [selectedWarehouse, setSelectedWarehouse] = useState<string>("");
    const [warehouse, setWarehouse] = useState<Warehouse[]>([]);
    const [devices, setDevices] = useState<Device[]>([]);
    const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
    const [selectedTelemetry, setSelectedTelemetry] = useState<string[]>(["Temperature"]);
    const theme = useTheme();
    const [data, setData] = useState<TelemetryData | null>(null);
    const [humidity, setHumidity] = useState<TelemetryData | null>(null);
    const [Power, setPower] = useState<TelemetryData | null>(null);
    const [display, setDisplay] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchAllWarehouses = async () => {
        try {
            const params =  {
                pageSize: 100,
                page: 0
            }
            const response = await getAllWarehouseByUserId(currentUser.id?.id || "", params);
            setTimeout(() => {
                setWarehouse(response.data.data);
                setLoading(false);
            }, 700);
        } catch (error) {
            console.error("Failed to fetch warehouses:", error);
            setTimeout(() => {
                setWarehouse([]);
                setLoading(false);
            }, 700);
        }
    };

    const handleWarehouseChange = async (e: SelectChangeEvent<string>) => {
        const selectedValue = e.target.value;
        setSelectedWarehouse(selectedValue);
        try {
            const filteredDevices = await getFilteredDevices(selectedValue);
            setDevices(filteredDevices);
        } catch (error) {
            console.error("Failed to fetch devices:", error);
        }
    };

    const handleCheckboxChange = (deviceId: string) => {
        setSelectedDevice(prevSelected => (prevSelected === deviceId ? null : deviceId));
    };

    const handleTelemetryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSelectedTelemetry(prevSelected => {
            const newSelection = prevSelected.includes(value)
                ? prevSelected.filter(t => t !== value)
                : [...prevSelected, value];

            // Ensure at least one checkbox is selected
            return newSelection.length > 0 ? newSelection : prevSelected;
        });
    };

    const getTelemetryData = async (): Promise<any | null> => {
        if (selectedDevice) {
            try {

                const keyresponse = await getTimeseriesKeys('DEVICE', selectedDevice);

                const params:any = {
                    keys:
                        keyresponse.data.join(','),
                    startTs: Date.now() - 300000, // last five minutes
                    endTs: Date.now(),
                    limit: 100,
                    orderBy: 'ASC',
                };

                const response = await getTimeseries("DEVICE", selectedDevice, params);
                console.log(response)
                return response.data;
            } catch (error) {
                console.error("Failed to fetch telemetry data:", error);
                return null;
            }
        }
        return null;
    };

    useEffect(() => {
        fetchAllWarehouses();
    }, []);

    useEffect(() => {
        if (selectedWarehouse) {
            setDisplay(true);
        } else {
            setDisplay(false);
        }
    }, [selectedWarehouse]);

    const seriesData: any = [
        selectedTelemetry.includes("Temperature") && data ? { data: data.value, label: 'Temperature' } : null,
        selectedTelemetry.includes("Humidity") && humidity ? { data: humidity.value, label: 'Humidity' } : null,
        selectedTelemetry.includes("Power") && Power ? { data: Power.value, label: 'Power' } : null
    ].filter(Boolean);

    useEffect(() => {
        const fetchTelemetry = async () => {
            const telemetryData = await getTelemetryData();

            if (telemetryData && Object.keys(telemetryData).length !== 0) {
                setData({
                    ts: [...(telemetryData.temperature?.map((t: any) => formatDate(t.ts)) || [])],
                    value: [...(telemetryData.temperature?.map((t: any) => t.value) || [])],
                });
                setHumidity({
                    ts: [...(telemetryData.humidity?.map((t: any) => formatDate(t.ts)) || [])],
                    value: [...(telemetryData.humidity?.map((t: any) => t.value) || [])],
                });
                setPower({
                    ts: [...(telemetryData.power?.map((t: any) => formatDate(t.ts)) || [])],
                    value: [...(telemetryData.power?.map((t: any) => t.value) || [])],
                });
            } else {
                setData(null);
                setHumidity(null);
                setPower(null);
            }
        };

        fetchTelemetry();
        const interval = setInterval(fetchTelemetry, 3000);

        return () => clearInterval(interval);
    }, [selectedDevice]);

    const formatDate = (timestamp: number): string => new Date(timestamp).toLocaleString();

    const telemetryCheckboxes = [
        { label: 'Temperature', value: 'Temperature' },
        { label: 'Humidity', value: 'Humidity' },
        { label: 'Power', value: 'Power' }
    ];

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="menu-data">
            {warehouse.length === 0 ? (
                <div className="error-show">No Warehouse Found</div>
            ) : (
                <div className="charts">
                    <div className="chart">
                        <h2>Charts</h2>
                        <FormControl className="form-control">
                            <InputLabel id="warehouse-label">Select Warehouse</InputLabel>
                            <Select
                                labelId="warehouse-label"
                                id="warehouse-select"
                                value={selectedWarehouse}
                                label="Select Warehouse"
                                onChange={handleWarehouseChange}
                                className="form-control-inner"
                            >
                                {warehouse.map((wh) => (
                                    <MenuItem key={wh.warehouse_id} value={wh.warehouse_id}>
                                        {wh.warehouse_name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <div className={display ? "display" : "nodisplay"}>
                            <Paper style={{ height: 'max-content', width: '100%' }}>
                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 650 }} aria-label="device table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ backgroundColor: theme.palette.primary.main, color: 'white' }}>Select</TableCell>
                                                <TableCell sx={{ backgroundColor: theme.palette.primary.main, color: 'white' }}>Device Name</TableCell>
                                                <TableCell align="right" sx={{ backgroundColor: theme.palette.primary.main, color: 'white' }}>ID</TableCell>
                                                <TableCell align="right" sx={{ backgroundColor: theme.palette.primary.main, color: 'white' }}>Status</TableCell>
                                                <TableCell align="right" sx={{ backgroundColor: theme.palette.primary.main, color: 'white' }}>Last Updated</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {devices.map((device) => (
                                                <TableRow key={device.id.id}>
                                                    <TableCell padding="checkbox">
                                                        <Checkbox
                                                            checked={selectedDevice === device.id.id}
                                                            onChange={() => handleCheckboxChange(device.id.id)}
                                                            inputProps={{ 'aria-label': 'select device' }}
                                                        />
                                                    </TableCell>
                                                    <TableCell component="th" scope="row" className="tablecell"><p>{device.name}</p></TableCell>
                                                    <TableCell align="right" className="tablecell"><p>{device.id.id}</p></TableCell>
                                                    <TableCell align="right" className="tablecell"><p>{device.status}</p></TableCell>
                                                    <TableCell align="right" className="tablecell"><p>{new Date(device.createdTime).toLocaleString()}</p></TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                            <div className="linegraph-chart">
                                <div>
                                    {telemetryCheckboxes.map((checkbox) => (
                                        <FormControlLabel
                                            key={checkbox.value}
                                            control={
                                                <Checkbox
                                                    checked={selectedTelemetry.includes(checkbox.value)}
                                                    onChange={handleTelemetryChange}
                                                    value={checkbox.value}
                                                />
                                            }
                                            label={checkbox.label}
                                        />
                                    ))}
                                </div>
                                {selectedDevice ? (
                                    seriesData.length > 0 ? (
                                        <LineChart
                                            width={900}
                                            height={600}
                                            series={seriesData}
                                            xAxis={[{ scaleType: 'point', data: data?.ts || [] }]}
                                            grid={{ vertical: true, horizontal: true }}
                                        />
                                    ) : (
                                        <p>No valid data available for the selected device.</p>
                                    )
                                ) : (
                                    <p>Please select a device to view telemetry data.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Charts;
