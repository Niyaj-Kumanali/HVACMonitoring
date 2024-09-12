import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { useParams } from 'react-router-dom';
import './styles/Dashboard.css';
import Widget from './Widget';
import DashboardHeader from './DashboardHeader';
import { setLayout } from '../../Redux/Action/layoutActions';
import AddWidget from '../Add-Widget/AddWidget';
import Box from '@mui/material/Box';
import { chartTypes, WidgetLayout } from '../../types/thingsboardTypes';
import { v4 as uuid4 } from 'uuid';
import { RootState } from '../../Redux/Reducer';
import { getLayout, postLayout } from '../../api/MongoAPIInstance';

const ResponsiveGridLayout = WidthProvider(Responsive);

const GRID_WIDTH = 1500;

// Breakpoints and columns
const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
const cols = { lg: 14, md: 10, sm: 8, xs: 6, xxs: 4 };

const Dashboard: React.FC = () => {
  const { dashboardId } = useParams();
  const dispatch = useDispatch();
  const gridLayoutRef = useRef<HTMLDivElement | null>(null);

  const storedLayout = useSelector(
    (state: RootState) =>
      state.dashboardLayout[dashboardId || ''] || { layout: [], dateRange: {} }
  );
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [isClicked, setIsClicked] = useState<boolean>(false);

  const [localLayout, setLocalLayout] = useState<Layout[]>([]);
  const [rowHeight, setRowHeight] = useState<number>(50); // Dynamically adjusted row height
  const [gridWidth, setGridWidth] = useState<number>(GRID_WIDTH); // Dynamic grid width for zoom handling

  useEffect(() => {
    const fetchDashboardLayout = async () => {
      const response = await getLayout(dashboardId);
      setLocalLayout(response.data.layout);
    };

    fetchDashboardLayout();
  }, [dashboardId]);

  useEffect(() => {
    if (storedLayout.layout) {
      setLocalLayout(storedLayout.layout);
    }
  }, [storedLayout]);

  // Adjust row height and grid width based on zoom level and screen size
  useEffect(() => {
    const handleResizeAndZoom = () => {
      const zoomLevel = window.outerWidth / window.innerWidth;

      // Adjust grid width and rowHeight dynamically based on zoom level
      const adjustedRowHeight = Math.max(Math.floor((window.innerHeight / 20) * zoomLevel), 30);
      const adjustedGridWidth = GRID_WIDTH * zoomLevel;

      setRowHeight(adjustedRowHeight); // Adjust row height based on zoom
      setGridWidth(adjustedGridWidth); // Adjust grid width based on zoom
    };

    handleResizeAndZoom(); // Initial calculation
    window.addEventListener('resize', handleResizeAndZoom); // Recalculate on window resize and zoom

    return () => {
      window.removeEventListener('resize', handleResizeAndZoom);
    };
  }, []);

  const onAddWidget = async (deviceId: string, selectedChart: chartTypes) => {
    const newWidget: WidgetLayout = {
      i: `widget-${uuid4()}`,
      x: 0,
      y: Math.max(...localLayout.map((item) => item.y + item.h || 0)) + 1,
      w: 4,
      h: 6,
      minW: 4,
      minH: 6,
      maxW: cols.lg,
      maxH: 12,
      chart: selectedChart,
      defaultDevice: deviceId,
    };

    const updatedLayout: WidgetLayout[] = [...localLayout, newWidget];
    setLocalLayout(updatedLayout);
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
        layout: localLayout,
      };

      dispatch(setLayout(dashboardId, layoutBody));
      await postLayout(dashboardId, layoutBody);
    }
  };

  const validateLayout = (newLayout: WidgetLayout[]) => {
    return newLayout.map((item) => ({
      ...item,
      x: Math.min(item.x, cols.lg - item.w),
    }));
  };

  const onLayoutChange = async (newLayout: Layout[]) => {
    const validatedLayout: WidgetLayout[] = validateLayout(newLayout);

    const updatedWidgets = localLayout.map((widget) => {
      const newWidget = validatedLayout.find((w) => w.i === widget.i);
      return newWidget ? { ...widget, ...newWidget } : widget;
    });

    setLocalLayout(updatedWidgets);
    dispatch(
      setLayout(dashboardId, { ...storedLayout, layout: updatedWidgets })
    );
  };

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
            layouts={{ lg: localLayout }}
            breakpoints={breakpoints}
            cols={cols}
            rowHeight={rowHeight} // Dynamic row height
            maxRows={10}
            isDraggable={isEditable}
            isResizable={isEditable}
            onLayoutChange={onLayoutChange}
            onResizeStop={onLayoutChange}
            onDragStop={onLayoutChange}
            width={gridWidth} // Dynamic grid width based on zoom
          >
            {localLayout.map((item: WidgetLayout) => (
              <div key={item.i} data-grid={item} className="widget-container">
                <Widget
                  widgetId={item.i}
                  deviceId={item.defaultDevice || ''}
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
