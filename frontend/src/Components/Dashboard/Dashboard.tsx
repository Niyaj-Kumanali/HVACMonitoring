import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Layout, Responsive, WidthProvider } from 'react-grid-layout';
import { useParams } from 'react-router-dom';
import './styles/Dashboard.css';
import DashboardHeader from './DashboardHeader';
import AddWidget, { chartTypes } from '../Add-Widget/AddWidget';
import Box from '@mui/material/Box';
import { WidgetLayout } from '../../types/thingsboardTypes';
import { v4 as uuid4 } from 'uuid';
import { RootState } from '../../Redux/Reducer';
import { getLayout, postLayout } from '../../api/MongoAPIInstance';
import { setLayout } from '../../Redux/Action/layoutActions';
import DashboardLayout from './DashboardLayout';

const ResponsiveGridLayout = WidthProvider(Responsive);
const ROW_HEIGHT = 50;
const GRID_WIDTH = 1200

const Dashboard: React.FC = () => {
  const { dashboardId } = useParams();
  const dispatch = useDispatch();
  const gridLayoutRef = useRef<HTMLDivElement | null>(null);

  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  // const [localLayout, setLocalLayout] = useState<Layout[]>([]);
  const [rowHeight, setRowHeight] = useState<number>(ROW_HEIGHT);
  const [gridWidth, setGridWidth] = useState<number>(GRID_WIDTH);

  const storedLayout = useSelector(
    (state: RootState) =>
      state.dashboardLayout[dashboardId || ''] || { layout: [], dateRange: {} }
  );

  useEffect(() => {
    const fetchDashboardLayout = async () => {
      const response = await getLayout(dashboardId);
      // setLocalLayout(response.data.layout);
      dispatch(setLayout(dashboardId, response.data));
    };

    fetchDashboardLayout();
  }, [dashboardId, dispatch]);

  // useEffect(() => {
  //   if (storedLayout.layout) {
  //     setLocalLayout(storedLayout.layout);
  //   }
  // }, [storedLayout]);

  // Dynamically adjust row height and grid width
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setGridWidth(width > 1200 ? 1200 : width * 0.9); // Adjust width based on screen size
      setRowHeight(height > 800 ? 50 : 30); // Adjust row height based on screen size
    };

    handleResize(); // Initial call
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onAddWidget = async (
    deviceId: string,
    selectedChart: chartTypes,
    selectedSensors: string[]
  ) => {
    const newWidget: WidgetLayout = {
      i: `widget-${uuid4()}`,
      x: 0,
      y: Math.max(...storedLayout.layout.map((item) => item.y + item.h || 0)) + 1,
      w: 5,
      h: 6,
      minW: 5,
      minH: 6,
      maxW: cols.lg,
      maxH: 12,
      chart: selectedChart,
      selectedDevice: deviceId,
      selectedSensors: selectedSensors,
    };

    const updatedLayout: WidgetLayout[] = [...storedLayout.layout, newWidget];
    // setLocalLayout(updatedLayout);
    const layoutBody = {
      ...storedLayout,
      layout: updatedLayout,
    };

    dispatch(setLayout(dashboardId, layoutBody));
  };

  const onToggleEdit = async () => {
    setIsEditable((prev) => !prev);
    if (isEditable) {
      const layoutBody = {
        ...storedLayout,
        layout: storedLayout.layout,
      };

      dispatch(setLayout(dashboardId, layoutBody));
      await postLayout(dashboardId, layoutBody);
    }
  };

  const validateLayout = (newLayout: WidgetLayout[]) => {
    return newLayout.map((item) => ({
      ...item,
      x: Math.min(item.x, cols.lg - item.w),
      minW: 5,
      minH: 6,
      maxW: cols.lg,
      maxH: 12,
    }));
  };

  const onLayoutChange = async (newLayout: Layout[]) => {
    const validatedLayout: WidgetLayout[] = validateLayout(newLayout);

    const updatedWidgets = storedLayout.layout.map((widget) => {
      const newWidget = validatedLayout.find((w) => w.i === widget.i);
      return newWidget ? { ...widget, ...newWidget } : widget;
    });

    // setLocalLayout(updatedWidgets);
    const layoutBody = { ...storedLayout, layout: updatedWidgets };
    dispatch(setLayout(dashboardId, layoutBody));

    await postLayout(dashboardId, layoutBody);
  };

  const breakpoints = {
    lg: gridWidth,
    md: gridWidth * 0.75,
    sm: gridWidth * 0.5,
    xs: gridWidth * 0.25,
    xxs: gridWidth * 0.1,
  };
  const cols = { lg: 14, md: 10, sm: 8, xs: 6, xxs: 4 };

  return (
    <div className="dashboard-container menu-data">
      <>
        <DashboardHeader
          onToggleEdit={onToggleEdit}
          onAddWidget={() => setIsClicked(true)}
          isEditable={isEditable}
        />
        <Box
          height="100%"
          className="layout-container"
          ref={gridLayoutRef}
          style={{ position: 'relative' }}
        >
          <ResponsiveGridLayout
            className="layout"
            layouts={{ lg: storedLayout.layout }}
            breakpoints={breakpoints}
            cols={cols}
            rowHeight={rowHeight} // Use dynamic row height
            maxRows={25}
            isDraggable={isEditable}
            isResizable={isEditable}
            onLayoutChange={onLayoutChange}
            onResizeStop={onLayoutChange}
            onDragStop={onLayoutChange}
            width={gridWidth} // Use dynamic grid width
          >
            {storedLayout.layout.map((item: WidgetLayout) => (
              <div key={item.i} data-grid={item} className="widget-container">
                <DashboardLayout
                  widgetId={item.i}
                  deviceId={item.selectedDevice || ''}
                  chartType={item.chart || 'Line'}
                />
              </div>
            ))}
          </ResponsiveGridLayout>
        </Box>
        {isClicked && (
          <AddWidget onAdd={onAddWidget} onClose={() => setIsClicked(false)} />
        )}
      </>
    </div>
  );
};

export default Dashboard;
