/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo, useCallback } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Scatter,
  ScatterChart,
} from 'recharts';
import '../styles/charts.css';
import { DownloadRounded } from '@mui/icons-material';
import { Tooltip as Tool, IconButton } from '@mui/material';
import { chartTypes } from '../../Add-Widget/AddWidget';
import { exportToExcel } from '../../../Utility/utility_functions';

export interface TelemetryDataItem {
  ts: number;
  value: string | number;
}

interface ChartProps {
  data: Record<string, TelemetryDataItem[]>; // Data structure
  chartType: chartTypes; // Restricted chart type
  thresholds?: Record<string, number>; // Optional thresholds for each series
}

const Chart: React.FC<ChartProps> = ({
  data,
  chartType,
  thresholds = {}, // Defaults to empty object
}) => {
  const seriesKeys = useMemo(() => Object.keys(data), [data]);

  const formatData = (
    data: Record<string, TelemetryDataItem[]>,
    seriesKeys: string[]
  ) => {
    const formattedData = seriesKeys.flatMap((key) => {
      const seriesData = data[key].sort(
        (a: TelemetryDataItem, b: TelemetryDataItem) => a.ts - b.ts
      );
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
    return formattedData.reduce(
      (
        acc: Array<Record<string, string | number>>,
        curr: Record<string, string | number>
      ) => {
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
  };

  // Fixed color palette
  const colorPalette = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#a4de6c'];

  // Function to get color for a series based on its index
  const getColor = useCallback(
    (index: number) => colorPalette[index % colorPalette.length],
    [colorPalette]
  );

  const groupedData = useMemo(
    () => formatData(data, seriesKeys),
    [data, seriesKeys]
  );

  // Memoized renderChart function
  const renderChart = useMemo(() => {
    const renderThresholdLines = () => {
      return seriesKeys.map((key, index) => {
        const threshold = thresholds[key];
        if (
          threshold !== undefined &&
          threshold > 0 &&
          seriesKeys.includes(key)
        ) {
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

    const renderCommonElements = () => (
      <>
        <XAxis
          dataKey="name"
          tickFormatter={(tick) => new Date(tick).toLocaleTimeString()}
        />
        <YAxis />
        <Tooltip labelFormatter={(label) => new Date(label).toLocaleString()} />
        <Legend
          layout="horizontal"
          align="left"
          verticalAlign="top"
          className="custom-legend"
        />
        {renderThresholdLines()}
      </>
    );

    switch (chartType) {
      case 'Line':
        return (
          <LineChart data={groupedData}>
            {renderCommonElements()}
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
            {renderCommonElements()}
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
            {renderCommonElements()}
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

      case 'Scatter':
        return (
          <ScatterChart data={groupedData}>
            {renderCommonElements()}
            {seriesKeys.map((key, index) => (
              <Scatter
                key={key}
                dataKey={key}
                fill={getColor(index)} // Use `fill` for scatter points
                isAnimationActive={false} // Disable animations for faster rendering
              />
            ))}
          </ScatterChart>
        );

      default:
        return <div>Unsupported chart type</div>;
    }
  }, [chartType, groupedData, seriesKeys]);

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
        <IconButton onClick={() => exportToExcel(data, thresholds)}>
          <DownloadRounded />
        </IconButton>
      </Tool>
    </>
  );
};

export default React.memo(Chart);
