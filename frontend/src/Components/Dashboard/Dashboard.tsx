import React, { useState } from 'react';
import GridLayout, { Layout } from 'react-grid-layout';
import './Dashboard.css';
import Widget from './Widget';

// Extend the Layout type to include a "type" property
interface CustomLayout extends Layout {
  type?: 'line' | 'bar' | 'scatter' | 'pie';
}

const Dashboard: React.FC = () => {
  const [layout, setLayout] = useState<CustomLayout[]>([]);
  const [isEditable, setIsEditable] = useState<boolean>(false);

  const onAddWidget = () => {
    const newWidget = {
      i: `widget-${layout.length}`,
      x: 0,
      y: Math.max(...layout.map(item => item.y || 0)) + 4, // Adjusting y to place below existing widgets
      w: 4,
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
    <div className="menu-data dashboard">
      <button onClick={onToggleEdit}>{isEditable ? 'Save Layout' : 'Edit Layout'}</button>
      <button onClick={() => onAddWidget()}>Add Widget</button>
      <div className="layout-container">
        <GridLayout
          className="layout"
          layout={layout}
          cols={12}
          rowHeight={100}
          width={1200}
          isDraggable={isEditable}
          isResizable={isEditable}
          onLayoutChange={(layout) => setLayout(layout as CustomLayout[])}
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
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(col => (
          <div
            key={`v-line-${col}`}
            className="grid-line vertical-line"
            style={{ left: `${(col / 11) * 100}%` }}
          ></div>
        ))}
        {/* Add horizontal grid lines */}
        {[1, 2, 3, 4, 5].map(row => (
          <div
            key={`h-line-${row}`}
            className="grid-line horizontal-line"
            style={{ top: `${(row / 6) * 100}%` }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
