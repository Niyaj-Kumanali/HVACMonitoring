// LineChartWidget.tsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TelemetryData } from '../../types/thingsboardTypes';


interface LineChartWidgetProps {
  data: TelemetryData;
}

const LineChartWidget: React.FC<LineChartWidgetProps> = ({ data }) => {
  const formattedData = Object.keys(data).map((key) => ({
    name: key,
    ...data[key].reduce((acc, point) => ({ ...acc, [point.ts]: point.value }), {}),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={formattedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        {Object.keys(data).map((key) => (
          <Line type="monotone" dataKey={key} stroke="#8884d8" key={key} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartWidget;
