// src/components/ChartWidget.tsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface ChartWidgetProps {
  data: {
    [key: string]: { ts: number; value: string }[]; // Sensor data with timestamps and values
  };
}

const ChartWidget: React.FC<ChartWidgetProps> = ({ data }) => {
  // Extract the series keys (sensor names)
  const seriesKeys = Object.keys(data);

  // Format data for Recharts
  const formattedData = seriesKeys.flatMap((key) => {
    const seriesData = data[key];
    if (!Array.isArray(seriesData)) {
      console.warn(`Expected array for key ${key}, but got ${typeof seriesData}`);
      return [];
    }
    return seriesData.map((entry) => ({
      name: new Date(entry.ts).toISOString(), // Use timestamp as the X-axis label
      [key]: parseFloat(entry.value), // Convert value to a number
    }));
  });

  // Group the formatted data by timestamp to ensure all lines have consistent data points
  const groupedData = formattedData.reduce((acc: any[], curr) => {
    const existing = acc.find((item) => item.name === curr.name);
    if (existing) {
      Object.assign(existing, curr);
    } else {
      acc.push(curr);
    }
    return acc;
  }, []);

  return (
    <LineChart
      width={600}
      height={400}
      data={groupedData}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" tickFormatter={(tick) => new Date(tick).toLocaleTimeString()} />
      <YAxis />
      <Tooltip cursor={{ stroke: '#2BC790', strokeWidth: 2 }} />
      <Legend verticalAlign="top" height={16} />
      {seriesKeys.map((key, index) => (
        <Line
          key={index}
          type="monotone"
          dataKey={key}
          stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`} // Random color for each line
        />
      ))}
    </LineChart>
  );
};

export default ChartWidget;
