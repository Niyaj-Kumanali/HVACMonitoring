import React, { useState, useEffect } from 'react';
import GridLayout, { Layout } from 'react-grid-layout';
import { getTenantDevices } from '../../api/deviceApi';
import './Dashboard.css';
import { Device } from '../../types/thingsboardTypes';
import Widget from './Widget';

// Extend the Layout type to include a "type" property
interface CustomLayout extends Layout {
  type: 'line' | 'bar' | 'scatter' | 'pie';
}

const Dashboard: React.FC = () => {
  const [layout, setLayout] = useState<CustomLayout[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [isEditable, setIsEditable] = useState<boolean>(false);

  useEffect(() => {
    const fetchDevices = async () => {
      const params = {
        pageSize: 50,
        page: 0
      };
      const response = await getTenantDevices(params);
      setDevices(response.data.data);
      console.log(response.data.data);
    };

    fetchDevices();
  }, []);

  const onAddWidget = (type: 'line' | 'bar' | 'scatter' | 'pie') => {
    setLayout((prevLayout) => [
      ...prevLayout,
      { i: `widget-${prevLayout.length}`, x: 0, y: Infinity, w: 4, h: 4, type },
    ]);
  };

  const onToggleEdit = () => {
    setIsEditable((prev) => !prev);
  };

  return (
    <div className="menu-data dashboard">
      <button onClick={onToggleEdit}>{isEditable ? 'Save Layout' : 'Edit Layout'}</button>
      <button onClick={() => onAddWidget('line')}>Add Line Chart</button>
      <button onClick={() => onAddWidget('bar')}>Add Bar Chart</button>
      <button onClick={() => onAddWidget('scatter')}>Add Scatter Plot</button>
      <button onClick={() => onAddWidget('pie')}>Add Pie Chart</button>
      <GridLayout
        className="layout"
        layout={layout}
        cols={12}
        rowHeight={30}
        width={1200}
        isDraggable={isEditable}
        isResizable={isEditable}
        onLayoutChange={(layout) => setLayout(layout as CustomLayout[])}
      >
        {layout.map((item) => (
          <div key={item.i} data-grid={item}>
            <Widget devices={devices} type={item.type} />
          </div>
        ))}
      </GridLayout>
    </div>
  );
};

export default Dashboard;
