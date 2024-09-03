// PieChartWidget.tsx
import React from 'react';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, Legend } from 'recharts';
import { TelemetryData } from '../../types/thingsboardTypes';

interface PieChartWidgetProps {
  data: TelemetryData;
}

const PieChartWidget: React.FC<PieChartWidgetProps> = ({ data }) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Aggregate data for Pie Chart display
  const pieData = Object.keys(data).map((key, index) => {
    const total = data[key].reduce((sum, point) => sum + point.value, 0);
    return { name: key, value: total };
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={pieData}
          dataKey="value"
          nameKey="name"
          outerRadius={100}
          fill="#8884d8"
          label
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieChartWidget;
