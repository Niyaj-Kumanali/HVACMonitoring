/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ComposedChart,
  Scatter,
  ScatterChart, // Import ReferenceLine
} from 'recharts';
import '../styles/charts.css';
import * as XLSX from 'xlsx';
import { DownloadRounded } from '@mui/icons-material';
import { Tooltip as Tool, IconButton } from '@mui/material';
import { chartTypes } from '../../Add-Widget/AddWidget';

interface TelemetryDataItem {
  ts: string | number; // Timestamp can be a string or number
  value: string | number; // Value can be a string or number
}

interface LineChartWidgetProps {
  data: Record<string, TelemetryDataItem[]>; // Data structure
  chartType: chartTypes; // Restricted chart type
  thresholds?: Record<string, number>; // Optional thresholds for each series
}

const Chart: React.FC<LineChartWidgetProps> = ({
  data,
  chartType,
  thresholds = {}, // Defaults to empty object
}) => {
  const [groupedData, setGroupedData] = useState<Array<Record<string, any>>>(
    []
  );
  const seriesKeys = Object.keys(data);
  useEffect(() => {
    const formattedData = seriesKeys.flatMap((key) => {
      const seriesData = data[key].sort((a: any, b: any) => a.ts - b.ts);
      if (!Array.isArray(seriesData)) {
        console.warn(
          `Expected array for key ${key}, but got ${typeof seriesData}`
        );
        return [];
      }
      return seriesData.map((entry) => ({
        name: new Date(entry.ts).toISOString(), // Use timestamp as the X-axis label
        [key]:
          typeof entry.value === 'string'
            ? parseFloat(entry.value)
            : entry.value, // Convert value to a number if it's a string
      }));
    });

    console.log(formattedData)
    // Group the formatted data by timestamp
    const groupedData = formattedData.reduce(
      (acc: Array<Record<string, any>>, curr) => {
        const existing = acc.find((item) => item.name === curr.name);
        if (existing) {
          Object.assign(existing, curr);
        } else {
          acc.push(curr);
        }
        return acc;
      },
      []
    );

    console.log(data['temperature']);
    console.log(groupedData);

    setGroupedData(groupedData);
  }, [data, seriesKeys]);

  const exportToExcel = (data: Record<string, TelemetryDataItem[]>) => {
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

  // Fixed color palette
  const colorPalette = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#a4de6c'];

  // Function to get color for a series based on its index
  const getColor = (index: number) => colorPalette[index % colorPalette.length];

  // Memoized renderChart function
  const renderChart = useMemo(() => {
    const renderThresholdLines = () => {
      return seriesKeys.map((key, index) => {
        const threshold = thresholds[key];
        if (threshold !== undefined && threshold > 0) {
          return (
            <ReferenceLine
              key={`threshold-${key}`}
              y={threshold} // The threshold value for this key
              stroke={getColor(index)}
              strokeDasharray="3 3"
              label={{
                value: `${key} (${threshold})`,
                position: 'insideTop', // You can change the label position here
                fill: getColor(index),
                fontSize: 12,
              }}
            />
          );
        }
        return null;
      });
    };

    switch (chartType) {
      case 'Line':
        return (
          <LineChart data={groupedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tickFormatter={(tick) => new Date(tick).toLocaleTimeString()}
            />
            <YAxis />
            <Tooltip labelFormatter={(label) => `${new Date(label)}`} />
            <Legend
              layout="horizontal"
              align="left"
              verticalAlign="top"
              className="custom-legend"
            />
            {seriesKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={getColor(index)} // Use fixed color
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            ))}
            {renderThresholdLines()}
          </LineChart>
        );

      case 'Bar':
        return (
          <BarChart data={groupedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tickFormatter={(tick) => new Date(tick).toLocaleTimeString()}
            />
            <YAxis />
            <Tooltip labelFormatter={(label) => `${new Date(label)}`} />
            <Legend
              layout="horizontal"
              align="left"
              verticalAlign="top"
              className="custom-legend"
            />
            {seriesKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={getColor(index)} // Use fixed color
              />
            ))}
            {renderThresholdLines()}
          </BarChart>
        );

      case 'Area':
        return (
          <AreaChart data={groupedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tickFormatter={(tick) => new Date(tick).toLocaleTimeString()}
            />
            <YAxis />
            <Tooltip labelFormatter={(label) => `${new Date(label)}`} />
            <Legend
              layout="horizontal"
              align="left"
              verticalAlign="top"
              className="custom-legend"
            />
            {seriesKeys.map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={getColor(index)} // Use fixed color
                fill={getColor(index)} // Use fixed color
                fillOpacity={0.3}
              />
            ))}
            {renderThresholdLines()}
          </AreaChart>
        );

      case 'Scatter':
        return (
          <ScatterChart data={groupedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tickFormatter={(tick) => new Date(tick).toLocaleTimeString()} // Converts timestamp to a readable time
            />
            <YAxis />
            <Tooltip
              labelFormatter={(label) => new Date(label).toLocaleString()} // Displays a readable date in tooltip
              formatter={(value) => value} // Optionally format the data point values
            />
            <Legend
              layout="horizontal"
              align="left"
              verticalAlign="top"
              className="custom-legend"
            />
            {seriesKeys.map((key, index) => (
              <Scatter
                key={key}
                dataKey={key}
                fill={getColor(index)} // Use `fill` for scatter points
                isAnimationActive={false} // Disable animations for faster rendering
              />
            ))}
            {renderThresholdLines()}{' '}
            {/* Optional custom rendering for threshold lines */}
          </ScatterChart>
        );

      default:
        return <div>Unsupported chart type</div>;
    }
  }, [chartType, getColor, groupedData, seriesKeys, thresholds]);

  return (
    <>
      <ResponsiveContainer width="99%" height="80%">
        {renderChart}
      </ResponsiveContainer>
      <Tool
        title="Export to Excel"
        placement="top"
        arrow
        className="download-icon"
      >
        <IconButton onClick={() => exportToExcel(data)}>
          <DownloadRounded />
        </IconButton>
      </Tool>
    </>
  );
};

export default React.memo(Chart);
