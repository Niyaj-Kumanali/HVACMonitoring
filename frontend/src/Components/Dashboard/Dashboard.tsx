import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GridLayout, { Layout } from 'react-grid-layout';
import { useParams } from 'react-router-dom';
import './styles/Dashboard.css'; // Ensure this is correctly imported
import Widget from './Widget';
import DashboardHeader from './DashboardHeader';
import { RootState } from '../../Redux/Reducer';
import { setLayout } from '../../Redux/Action/layoutActions';
import AddWidget from '../Add-Widget/AddWidget';
import Box from '@mui/material/Box';
import DashboardSettings from './DashboardSettings';
import { chartTypes, WidgetLayout } from '../../types/thingsboardTypes';
import { v4 as uuid4 } from 'uuid';

const GRID_WIDTH = 1500; // Total width of the grid
const NUM_COLUMNS = 14; // Number of columns
const ROW_HEIGHT = 50; // Height of each row

const Dashboard: React.FC = () => {
  const { dashboardId } = useParams();
  const dispatch = useDispatch();
  const gridLayoutRef = useRef<HTMLDivElement | null>(null);

  const storedLayout = useSelector(
    (state: RootState) =>
      state.dashboardLayout[dashboardId || ''] || { layout: [], dateRange: {} }
  );

  const [layout, setLocalLayout] = useState<Layout[]>(storedLayout.layout);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [isSettingClicked, setIsSettingClicked] = useState<boolean>(false);

  useEffect(() => {
    if (storedLayout.layout) {
      setLocalLayout(storedLayout.layout);
    }
  }, [storedLayout]);

  const onAddWidget = (deviceId: string, selectedChart: chartTypes) => {
    const newWidget: WidgetLayout = {
      i: `widget-${uuid4()}`,
      x: 0,
      y: Math.max(...layout.map((item) => item.y + item.h || 0)) + 1,
      w: 4,
      h: 6,
      minW: 4,
      minH: 6,
      maxW: 12,
      maxH: 12,
      chart: selectedChart,
      defaultDevice: deviceId,
    };

    const updatedLayout: WidgetLayout[] = [...layout, newWidget];

    console.log(updatedLayout);
    setLocalLayout(updatedLayout);
    dispatch(
      setLayout(dashboardId, {
        ...storedLayout,
        layout: updatedLayout,
      })
    );
  };

  const onToggleEdit = () => {
    setIsEditable((prev) => !prev);
  };

  const validateLayout = (newLayout: WidgetLayout[]) => {
    return newLayout.map((item) => ({
      ...item,
      x: Math.min(item.x, NUM_COLUMNS - item.w),
    }));
  };

  const onLayoutChange = (newLayout: Layout[]) => {
    // Validate the new layout
    const validatedLayout: WidgetLayout[] = validateLayout(newLayout);

    // Preserve widget state
    const updatedWidgets = layout.map((widget) => {
      const newWidget = validatedLayout.find((w) => w.i === widget.i);
      return newWidget ? { ...widget, ...newWidget } : widget;
    });

    // Update the layout with preserved widget state
    setLocalLayout(updatedWidgets);
    dispatch(
      setLayout(dashboardId, { ...storedLayout, layout: updatedWidgets })
    );
  };
  const calculateGridLines = () => {
    if (!gridLayoutRef.current) return;

    const containerWidth = gridLayoutRef.current.offsetWidth;
    const containerHeight = gridLayoutRef.current.offsetHeight;

    // Calculate column width
    const columnWidth = containerWidth / NUM_COLUMNS;

    // Calculate number of horizontal lines
    const numHorizontalLines = Math.ceil(containerHeight / ROW_HEIGHT);

    return {
      columnWidth,
      numHorizontalLines,
    };
  };

  const { columnWidth, numHorizontalLines } = calculateGridLines() || {
    columnWidth: 0,
    numHorizontalLines: 0,
  };

  return (
    <div className="dashboard-container menu-data">
      {}

      {isClicked ? (
        <AddWidget onAdd={onAddWidget} onClose={() => setIsClicked(false)} />
      ) : (
        <>
          <DashboardHeader
            onToggleEdit={onToggleEdit}
            onAddWidget={() => setIsClicked(true)}
            isEditable={isEditable}
            onSettingClicked={setIsSettingClicked}
          />
          {isSettingClicked ? (
            <DashboardSettings onSettingClicked={setIsSettingClicked} />
          ) : (
            <Box
              height="100%"
              className="layout-container"
              ref={gridLayoutRef}
              style={{ position: 'relative' }}
            >
              <div className="grid-lines-overlay">
                {Array.from({ length: NUM_COLUMNS + 1 }).map((_, i) => (
                  <div
                    key={i}
                    className="grid-line vertical-line"
                    style={{
                      left: columnWidth * i,
                      top: 0,
                      height: '106%', // Span entire height of the container
                      width: '1px', // Adjust thickness if needed
                      backgroundColor: '#ccc', // Adjust color if needed
                    }}
                  />
                ))}
                {Array.from({ length: numHorizontalLines + 1 }).map((_, i) => (
                  <div
                    key={i}
                    className="grid-line horizontal-line"
                    style={{
                      top: ROW_HEIGHT * i,
                      left: 0,
                      width: '100%',
                      height: '1px', // Adjust thickness if needed
                      backgroundColor: '#ccc', // Adjust color if needed
                    }}
                  />
                ))}
              </div>
              <GridLayout
                className="layout"
                layout={layout}
                cols={NUM_COLUMNS}
                rowHeight={ROW_HEIGHT}
                width={GRID_WIDTH}
                isDraggable={isEditable}
                isResizable={isEditable}
                onLayoutChange={onLayoutChange}
                onResizeStop={onLayoutChange}
                onDragStop={onLayoutChange}
              >
                {layout.map((item: WidgetLayout) => (
                  <div
                    key={item.i}
                    data-grid={item}
                    className="widget-container"
                  >
                    <Widget
                        widgetId={item.i}
                        deviceId={item.defaultDevice || ''}
                        chartType={item.chart || 'Line'}
                      />
                    
                  </div>
                ))}
              </GridLayout>
            </Box>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
