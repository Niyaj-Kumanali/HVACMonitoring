import React, { useState, useEffect } from 'react';
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
} from 'recharts';
import '../styles/charts.css';
import { chartTypes } from '../../../types/thingsboardTypes';

interface TelemetryDataItem {
  ts: string | number; // Timestamp can be a string or number
  value: string | number; // Value can be a string or number
}

interface LineChartWidgetProps {
  data: Record<string, TelemetryDataItem[]>; // Data structure
  chartType: chartTypes; // Restricted chart type
}

const LineChartWidget: React.FC<LineChartWidgetProps> = ({
  data,
  chartType,
}) => {
  const [groupedData, setGroupedData] = useState<Array<Record<string, any>>>([]);
  const seriesKeys = Object.keys(data);

  useEffect(() => {
    const formattedData = seriesKeys.flatMap((key) => {
      const seriesData = data[key];
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

    // Group the formatted data by timestamp
    const groupedData = formattedData.reduce((acc: Array<Record<string, any>>, curr) => {
      const existing = acc.find((item) => item.name === curr.name);
      if (existing) {
        Object.assign(existing, curr);
      } else {
        acc.push(curr);
      }
      return acc;
    }, []);

    setGroupedData(groupedData);
  }, [data, seriesKeys]);

  // Fixed color palette
  const colorPalette = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#a4de6c'];

  // Function to get color for a series based on its index
  const getColor = (index: number) => colorPalette[index % colorPalette.length];

  const renderChart = () => {
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
            <Tooltip />
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
            <Tooltip />
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
            <Tooltip />
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
          </AreaChart>
        );

      // default:
      //   return null; // Return null if chartType is not valid
    }
  };

  return <ResponsiveContainer width="99%" height="80%">{renderChart()}</ResponsiveContainer>;
};

export default LineChartWidget;
