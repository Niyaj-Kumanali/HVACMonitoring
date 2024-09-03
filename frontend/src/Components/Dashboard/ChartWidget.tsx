// // ChartWidget.tsx
// import React from 'react';
// import Plot from 'react-plotly.js';
// import { TelemetryData } from '../../types/types';

// interface ChartWidgetProps {
//   data: TelemetryData;
// }

// const ChartWidget: React.FC<ChartWidgetProps> = ({ data }) => {
//   return (
//     <Plot
//       data={[
//         {
//           x: Object.keys(data),
//           y: Object.values(data).flat(),
//           type: 'scatter',
//           mode: 'lines+markers',
//           marker: { color: 'red' },
//         },
//       ]}
//       layout={{ title: 'Line Chart' }}
//     />
//   );
// };

// export default ChartWidget;


const ChartWidget = () => {
  return (
    <div>ChartWidget</div>
  )
}

export default ChartWidget
