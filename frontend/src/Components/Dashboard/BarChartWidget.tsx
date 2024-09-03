// BarChartWidget.tsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TelemetryData } from '../../types/thingsboardTypes';

interface BarChartWidgetProps {
  data: TelemetryData;
}

const BarChartWidget: React.FC<BarChartWidgetProps> = ({ data }) => {
  const formattedData = Object.keys(data).map((key) => ({
    name: key,
    ...data[key].reduce((acc, point) => ({ ...acc, [point.ts]: point.value }), {}),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={formattedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        {Object.keys(data).map((key) => (
          <Bar dataKey={key} fill="#8884d8" key={key} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartWidget;
