// src/components/Dashboard.tsx

import React, { useState, useEffect } from 'react';
import GridLayout, { Layout } from 'react-grid-layout';
import './Dashboard.css';
import Widget from './Widget';
import DashboardHeader from './DashboardHeader';
import { Container, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../Redux/Reducer';
import { setLayout } from '../../Redux/Action/layoutActions';


const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const storedLayout = useSelector((state: RootState) => state.layout.layout);
  const [layout, setLocalLayout] = useState<Layout[]>(storedLayout);
  const [isEditable, setIsEditable] = useState<boolean>(false);

  useEffect(() => {
    setLocalLayout(storedLayout);
  }, [storedLayout]);

  const onAddWidget = () => {
    const newWidget: Layout = {
      i: `widget-${layout.length}`,
      x: 0,
      y: Math.max(...layout.map((item) => item.y || 0)) + 4,
      w: 8,
      h: 4,
      minW: 5,
      minH: 5,
    };
    const updatedLayout = [...layout, newWidget];
    setLocalLayout(updatedLayout);
    dispatch(setLayout(updatedLayout));
  };

  const onToggleEdit = () => {
    setIsEditable((prev) => !prev);
  };

  const onLayoutChange = (newLayout: Layout[]) => {
    setLocalLayout(newLayout);
    dispatch(setLayout(newLayout));
  };

  return (
    <Container maxWidth="xl" className="dashboard-container menu-data">
      <DashboardHeader onToggleEdit={onToggleEdit} onAddWidget={onAddWidget} isEditable={isEditable} />
      <Box mt={3} className="layout-container">
        <GridLayout
          className="layout"
          layout={layout}
          cols={12}
          rowHeight={90}
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
