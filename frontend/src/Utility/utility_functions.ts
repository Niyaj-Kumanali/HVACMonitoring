import {v4 as uuid4} from 'uuid'
import * as XLSX from 'xlsx';
import { TelemetryDataItem } from '../Components/Dashboard/Charts/Chart';


export const uuid = () => {
  return uuid4()
}

export const formatNumber = (num: number) => {
  const formatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
  });

  return formatter.format(num);
};


export const exportToExcel = (data: Record<string, TelemetryDataItem[]>, thresholds: Record<string, number>) => {
  const formattedData = Object.entries(data)
    .flatMap(([key, seriesData]) => {
      return seriesData.map((entry) => {
        const value =
          typeof entry.value === 'string'
            ? parseFloat(entry.value)
            : entry.value;
        if (key && value > thresholds[key]) {
          return {
            timestamp: new Date(entry.ts).toLocaleString(),
            value: value,
            key: key,
          };
        }
        return null;
      });
    })
    .filter((entry) => entry !== null);

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Telemetry Data');
  XLSX.writeFile(workbook, 'telemetry_data.xlsx');
};