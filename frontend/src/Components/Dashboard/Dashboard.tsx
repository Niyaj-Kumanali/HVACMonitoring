// src/components/Dashboard.tsx

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GridLayout, { Layout } from 'react-grid-layout';
import { useParams } from 'react-router-dom'; // Import useParams
import './Dashboard.css';
import Widget from './Widget';
import DashboardHeader from './DashboardHeader';
import { Container, Box } from '@mui/material';
import { RootState } from '../../Redux/Reducer';
import { setLayout } from '../../Redux/Action/layoutActions';


const Dashboard: React.FC = () => {
  const { dashboardId } = useParams(); // Get dashboardId from the URL params
  const dispatch = useDispatch();

  const storedLayout = useSelector((state: RootState) => state.layout[dashboardId || ""] || []); // Get layout for specific dashboardId
  const [layout, setLocalLayout] = useState<Layout[]>(storedLayout);
  const [isEditable, setIsEditable] = useState<boolean>(false);

  useEffect(() => {
    setLocalLayout(storedLayout); // Update local layout when stored layout changes
  }, [storedLayout]);

  const onAddWidget = () => {
    const newWidget: Layout = {
      i: `widget-${layout.length}`,
      x: 0,
      y: Math.max(...layout.map((item) => item.y || 0)) + 4,
      w: 8,
      h: 3,
      minW: 5,
      minH: 5,
    };
    const updatedLayout = [...layout, newWidget];
    setLocalLayout(updatedLayout);
    dispatch(setLayout(dashboardId, updatedLayout)); // Save layout for specific dashboardId
  };

  const onToggleEdit = () => {
    setIsEditable((prev) => !prev);
  };

  const onLayoutChange = (newLayout: Layout[]) => {
    setLocalLayout(newLayout);
    dispatch(setLayout(dashboardId, newLayout)); // Save layout for specific dashboardId
  };

  return (
    <Container maxWidth="xl" className="dashboard-container menu-data">
      <DashboardHeader onToggleEdit={onToggleEdit} onAddWidget={onAddWidget} isEditable={isEditable} />
      <Box mt={3} className="layout-container">
        <GridLayout
          className="layout"
          layout={layout}
          cols={12}
          rowHeight={50}
          width={1200}
          isDraggable={isEditable}
          isResizable={isEditable}
          onLayoutChange={onLayoutChange}
          margin={[10, 10]}
          containerPadding={[10, 10]}
        >
          {layout.map((item) => (
            <div key={item.i} data-grid={item} className="widget-container">
              <Widget />
            </div>
          ))}
        </GridLayout>
      </Box>
    </Container>
  );
};

export default Dashboard;
