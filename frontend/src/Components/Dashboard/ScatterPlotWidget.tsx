// ScatterPlotWidget.tsx
import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TelemetryData } from '../../types/thingsboardTypes';

interface ScatterPlotWidgetProps {
  data: TelemetryData;
}

const ScatterPlotWidget: React.FC<ScatterPlotWidgetProps> = ({ data }) => {
  const formattedData = Object.keys(data).map((key) => ({
    name: key,
    points: data[key].map((point) => ({ x: point.ts, y: point.value })),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ScatterChart>
        <CartesianGrid />
        <XAxis type="number" dataKey="x" name="Time" />
        <YAxis type="number" dataKey="y" name="Value" />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Legend />
        {formattedData.map((dataset) => (
          <Scatter name={dataset.name} data={dataset.points} fill="#8884d8" key={dataset.name} />
        ))}
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default ScatterPlotWidget;
