import { useEffect, useState } from "react";
import { FormControl, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Checkbox } from "@mui/material";
import { getCurrentUser } from "../../api/loginApi";
import { mongoAPI } from "../../api/MongoAPIInstance";
import { getFilteredDevices } from "../../api/deviceApi";
import { getLatestTimeseries } from "../../api/telemetryAPIs";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useTheme } from '@mui/material/styles';
import { LineChart } from '@mui/x-charts/LineChart';
import "./Charts.css";


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
    const [selectedWarehouse, setSelectedWarehouse] = useState<string>("");
    const [warehouse, setWarehouse] = useState<Warehouse[]>([]);
    const [devices, setDevices] = useState<Device[]>([]);
    const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
    const theme = useTheme();
    const [data, setData] = useState<TelemetryData | null>(null);

    const fetchAllWarehouses = async () => {
        try {
            const currentUser = await getCurrentUser();
            const response = await mongoAPI.get(`/warehouse/getallwarehouse/${currentUser.data.id.id}`);
            setWarehouse(response.data);
        } catch (error) {
            console.error("Failed to fetch warehouses:", error);
        }
    };

    const handleWarehouseChange = async (e: SelectChangeEvent) => {
        const selectedValue = e.target.value;
        setSelectedWarehouse(selectedValue);
        const fdevices = await getFilteredDevices(selectedValue);
        setDevices(fdevices);
    };

    const handleCheckboxChange = (deviceId: string) => {
        setSelectedDevice((prevSelected) => (prevSelected === deviceId ? null : deviceId));
    };

    const getTelemetryData = async () => {
        if (selectedDevice) {
            try {
                const response = await getLatestTimeseries("DEVICE", selectedDevice);
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
        const interval = setInterval(async () => {
            const telemetryData = await getTelemetryData();
            if (telemetryData) {
                setData(prev => ({
                    ts: [...(prev?.ts || []), ...telemetryData.temperature.map((t: any) => formatDate(t.ts))],
                    value: [...(prev?.value || []), ...telemetryData.temperature.map((t: any) => t.value)],
                }));
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [selectedDevice, data]);

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    };
    

    return (
        <div className="menu-data">
            {warehouse.length > 0 ? (
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

                        {/* Device Table */}
                        <Paper style={{ height: '100%', width: '100%' }}>
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
                                                <TableCell align="right" className="tablecell"><p>{device.active ? "Online" : "Offline"}</p></TableCell>
                                                <TableCell align="right" className="tablecell"><p>{formatDate(device.createdTime)}</p></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                        <div>
                            {data ? (
                                <LineChart
                                    width={900}
                                    height={600}
                                    series={[
                                        { data: data.value, label: 'Temperature', yAxisId: 'leftAxisId' },
                                    ]}
                                    xAxis={[{ scaleType: 'point', data: data.ts}]}
                                    yAxis={[{ id: 'leftAxisId' }]}
                                    grid={{ vertical: true, horizontal: true }}
                                    
                                />
                            ) : (
                                <p>No telemetry data available</p>
                            )}
                            
                        </div>
                    </div>
                </div>
            ) : (
                <div>No Warehouse Data is Present</div>
            )}
        </div>
    );
};

export default Charts;
