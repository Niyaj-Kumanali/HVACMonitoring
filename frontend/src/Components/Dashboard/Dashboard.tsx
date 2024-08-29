// // src/components/Dashboard.tsx
// import React, { useState } from 'react';
// import GridLayout, { Layout } from 'react-grid-layout';
// import ChartWidget from './ChartWidget';
// import Header from './Header';

// interface DashboardProps {}

// const Dashboard: React.FC<DashboardProps> = () => {
//   const [layout, setLayout] = useState<Layout[]>([]);
//   const [isEditable, setIsEditable] = useState<boolean>(false);
//   const [selectedDevice, setSelectedDevice] = useState<string>('');
//   const [devices, setDevices] = useState<{ id: string; name: string }[]>([
//     { id: 'device1', name: 'Device 1' },
//     { id: 'device2', name: 'Device 2' },
//   ]);

//   const onEdit = () => {
//     setIsEditable(!isEditable);
//   };

//   const onSave = () => {
//     alert('Layout saved!');
//     setIsEditable(false);
//   };

//   const onAddChart = () => {
//     setLayout((prevLayout) => [
//       ...prevLayout,
//       { i: `chart-${prevLayout.length}`, x: 0, y: Infinity, w: 4, h: 4 },
//     ]);
//   };

//   const sampleData = [
//     { name: 'Jan', value: 30 },
//     { name: 'Feb', value: 20 },
//     { name: 'Mar', value: 50 },
//   ];

//   return (
//     <div>
//       <Header
//         devices={devices}
//         selectedDevice={selectedDevice}
//         onSelectDevice={setSelectedDevice}
//         onEdit={onEdit}
//         onSave={onSave}
//       />
//       <button onClick={onAddChart}>Add Chart</button>
//       <GridLayout
//         className="layout"
//         layout={layout}
//         cols={12}
//         rowHeight={30}
//         width={1200}
//         isDraggable={isEditable}
//         isResizable={isEditable}
//         onLayoutChange={(layout) => setLayout(layout)}
//       >
//         {layout.map((item) => (
//           <div key={item.i} data-grid={item}>
//             <ChartWidget data={sampleData} />
//           </div>
//         ))}
//       </GridLayout>
//     </div>
//   );
// };

// export default Dashboard;

import React from 'react'

const Dashboard = () => {
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard
