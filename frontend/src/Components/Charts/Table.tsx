import {
    Table as MuiTable,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';
import "./Charts.css"

const Tabledata = ({ maindatas }: { maindatas: any }) => {
    const combinedData: any = [];
    const maxLength = Math.max(...maindatas.map((item: any) => item.data.length));

    const thresholds = {
        Temperature: 25,
        Humidity: 50,
        Power: 10,
    };

    for (let i = 0; i < maxLength; i++) {
        maindatas.forEach((item: any) => {
            if (item.data[i] !== undefined) {
                const value = item.data[i];
                if ((item.label === 'Temperature' && value > thresholds.Temperature) ||
                    (item.label === 'Humidity' && value > thresholds.Humidity) ||
                    (item.label === 'Power' && value > thresholds.Power)) {
                    combinedData.push({ label: item.label, value, timestamp: item.ts[i] });
                }
            }
        });
    }

    return (
        <TableContainer component={Paper} sx={{ maxHeight: "500px", minWidth: "10%" }} className='table-cont'>
            <MuiTable stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ backgroundColor: '#1976d2', color: 'white' }}>Type</TableCell>
                        <TableCell sx={{ backgroundColor: '#1976d2', color: 'white' }}>Value</TableCell>
                        <TableCell sx={{ backgroundColor: '#1976d2', color: 'white' }}>Timestamp</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {combinedData.map((item: any, index: any) => (
                        <TableRow key={index}>
                            <TableCell>{item.label}</TableCell>
                            <TableCell>{item.value}</TableCell>
                            <TableCell>{item.timestamp}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </MuiTable>
        </TableContainer>
    );
};

export default Tabledata;
