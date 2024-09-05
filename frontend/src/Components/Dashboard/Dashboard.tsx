import React, { useState } from 'react';
import GridLayout, { Layout } from 'react-grid-layout';
import './Dashboard.css';
import Widget from './Widget';
import DashboardHeader from './DashboardHeader'; // Import the DashboardHeader component
import { Container, Box } from '@mui/material'; // Material UI for layout

// Extend the Layout type to include a "type" property
interface CustomLayout extends Layout {
  type?: 'line' | 'bar' | 'scatter' | 'pie';
}

const Dashboard: React.FC = () => {
  const [layout, setLayout] = useState<CustomLayout[]>([]);
  const [isEditable, setIsEditable] = useState<boolean>(false);

  const onAddWidget = () => {
    const newWidget: CustomLayout = {
      i: `widget-${layout.length}`,
      x: 0,
      y: Math.max(...layout.map((item) => item.y || 0)) + 4, // Adjusting y to place below existing widgets
      w: 8,
      h: 4,
      minW: 5, // Minimum width in grid units
      minH: 5, // Minimum height in grid units
    };
    setLayout((prevLayout) => [...prevLayout, newWidget]);
  };

  const onToggleEdit = () => {
    setIsEditable((prev) => !prev);
  };

  return (
    <Container maxWidth="xl" className="dashboard-container menu-data">
      {/* Use the DashboardHeader Component */}
      <DashboardHeader onToggleEdit={onToggleEdit} onAddWidget={onAddWidget} isEditable={isEditable} />

      <Box mt={3} className="layout-container">
        <GridLayout
          className="layout"
          layout={layout}
          cols={12}
          rowHeight={100}
          width={1200}
          isDraggable={isEditable}
          isResizable={isEditable}
          onLayoutChange={(newLayout) => setLayout(newLayout as CustomLayout[])}
          margin={[10, 10]} // Add margin between items
          containerPadding={[10, 10]} // Add padding inside the grid container
        >
          {layout.map((item) => (
            <div key={item.i} data-grid={item} className="widget-container">
              <Widget />
            </div>
          ))}
        </GridLayout>

        {/* Add vertical grid lines */}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((col) => (
          <div
            key={`v-line-${col}`}
            className="grid-line vertical-line"
            style={{ left: `${(col / 11) * 100}%` }}
          ></div>
        ))}

        {/* Add horizontal grid lines */}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((row) => (
          <div
            key={`h-line-${row}`}
            className="grid-line horizontal-line"
            style={{ top: `${(row / 9) * 100}%` }}
          ></div>
        ))}
      </Box>
    </Container>
  );
};

export default Dashboard;
