import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import '../styles/charts.css'

interface TelemetryDataItem {
  ts: string | number; // Timestamp can be a string or number
  value: string | number; // Value can be a string or number
}

interface LineChartWidgetProps {
  data: Record<string, TelemetryDataItem[]>; // Update to reflect the correct data structure
}

const LineChartWidget: React.FC<LineChartWidgetProps> = ({ data }) => {
  const [groupedData, setGroupedData] = useState<any[]>([]);
  const seriesKeys = Object.keys(data);

  // Format and group data
  useEffect(() => {
    const formattedData = seriesKeys.flatMap((key) => {
      const seriesData = data[key];
      if (!Array.isArray(seriesData)) {
        console.warn(`Expected array for key ${key}, but got ${typeof seriesData}`);
        return [];
      }
      return seriesData.map((entry) => ({
        name: new Date(entry.ts).toISOString(), // Use timestamp as the X-axis label
        [key]: typeof entry.value === 'string' ? parseFloat(entry.value) : entry.value, // Convert value to a number if it's a string
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

    setGroupedData(groupedData);
  }, [data, seriesKeys]);

  return (
    <ResponsiveContainer width="99%" height="80%">
      <LineChart data={groupedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          tickFormatter={(tick) => new Date(tick).toLocaleTimeString()}
          // interval={seriesKeys.length > 10 ? 'preserveStartEnd' : 0} // Adjust tick interval based on the number of series
        />
        <YAxis />
        <Tooltip />
        <Legend
          layout="horizontal" // Set legend layout to horizontal
          align="left"      // Align the legend horizontally in the center
          verticalAlign="top" // Position the legend at the top
          className="custom-legend" 
        />
        {/* Render a Line for each key in seriesKeys */}
        {seriesKeys.map((key, index) => (
          <Line
            key={index}
            type="monotone"
            dataKey={key}
            // stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`} // Random color for each line
            strokeWidth={2} // Adjust stroke width for visibility
            dot={false} // Remove dots to avoid cluttering
            isAnimationActive={false} // Disable animation if it causes issues
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartWidget;
