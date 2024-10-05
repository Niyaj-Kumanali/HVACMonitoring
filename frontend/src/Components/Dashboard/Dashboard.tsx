import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Layout, Responsive, WidthProvider } from 'react-grid-layout';
import { useParams } from 'react-router-dom';
import './styles/Dashboard.css';
import DashboardHeader from './DashboardHeader';
import AddWidget from '../Add-Widget/AddWidget';
import Box from '@mui/material/Box';
import { WidgetLayout, widgetType } from '../../types/thingsboardTypes';
import { v4 as uuid4 } from 'uuid';
import { RootState } from '../../Redux/Reducer';
import { setLayout } from '../../Redux/Action/layoutActions';
import DashboardLayout from './DashboardLayout';
import { getLayout, postLayout } from '../../api/dashboardApi';

const ResponsiveGridLayout = WidthProvider(Responsive);
const ROW_HEIGHT = 50;
const GRID_WIDTH = 1200;
const breakpoints = {
    lg: 1500,
    md: 960,
    sm: 768,
    xs: 480,
    xxs: 320,
};
const cols = {
    lg: 12, // 12 columns for large screens
    md: 12, // 10 columns for tablets in landscape
    sm: 12, // 6 columns for small tablets
    xs: 12, // 4 columns for large phones or small tablets
    xxs: 12, // 2 columns for small phones
};

const Dashboard: React.FC = () => {
    const { dashboardId } = useParams();

    const storedLayout = useSelector(
        (state: RootState) =>
            state.dashboardLayout[dashboardId || ''] || {
                layout: [],
                dateRange: {},
            }
    );
    const dispatch = useDispatch();
    const gridLayoutRef = useRef<HTMLDivElement | null>(null);
    const [isMobileView, setIsMobileView] = useState<boolean>(false);

    const [isEditable, setIsEditable] = useState<boolean>(false);
    const [isClicked, setIsClicked] = useState<boolean>(false);
    const [rowHeight, setRowHeight] = useState<number>(ROW_HEIGHT);
    const [gridWidth, setGridWidth] = useState<number>(GRID_WIDTH);

    useEffect(() => {
        const fetchDashboardLayout = async () => {
            const response = await getLayout(dashboardId);
            dispatch(setLayout(dashboardId, response.data));
        };

        fetchDashboardLayout();
    }, [dashboardId, dispatch]);

    // Dynamically adjust row height and grid width
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            setIsMobileView(width <= 768 ? true : false);

            let customWidth = breakpoints['lg'];

            if (width > breakpoints['lg']) {
                customWidth = breakpoints['lg'];
            } else if (width > breakpoints['md']) {
                customWidth = breakpoints['md'];
            } else if (width > breakpoints['sm']) {
                customWidth = breakpoints['sm'];
            } else if (width > breakpoints['xs']) {
                customWidth = breakpoints['xs'];
            } else {
                customWidth = breakpoints['xxs'];
            }
            setGridWidth(customWidth); // Adjust width based on screen size
            setRowHeight(height > 800 ? 50 : 30); // Adjust row height based on screen size
        };

        handleResize(); // Initial call
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const onAddWidget = async (args: widgetType) => {
        const newWidget: WidgetLayout = {
            ...args,
            i: `widget-${uuid4()}`,
            x: 0,
            y:
                // Math.max(
                //     ...(storedLayout?.layout || []).map(
                //         (item) => item.y + item.h || 0
                //     )
                // ) + 1,
                Infinity,
            w: 5,
            h: 6,
            minW: 5,
            minH: 6,
            maxW: cols.lg,
            maxH: 12,
        };

        const updatedLayout: WidgetLayout[] = [
            ...(storedLayout?.layout || []),
            newWidget,
        ];
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
                layout: storedLayout?.layout || [],
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

        const updatedWidgets = (storedLayout?.layout || []).map((widget) => {
            const newWidget = validatedLayout.find((w) => w.i === widget.i);
            return newWidget ? { ...widget, ...newWidget } : widget;
        });

        const layoutBody = { ...storedLayout, layout: updatedWidgets };
        dispatch(setLayout(dashboardId, layoutBody));

        await postLayout(dashboardId, layoutBody);
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
                    {isMobileView ? (
                        <Box className="layout">
                            {(storedLayout?.layout || []).map(
                                (item: WidgetLayout) => (
                                    <div
                                        key={item.i}
                                        data-grid={item}
                                        className="widget-container"
                                    >
                                        <DashboardLayout
                                            key={item.i}
                                            widgetId={item.i}
                                            deviceId={item.selectedDevice || ''}
                                            chartType={item.chart || 'Line'}
                                        />
                                    </div>
                                )
                            )}
                        </Box>
                    ) : (
                        <ResponsiveGridLayout
                            className="layout"
                            layouts={{
                                lg: storedLayout?.layout || [],
                                md: storedLayout?.layout || [],
                                sm: storedLayout?.layout || [],
                                xs: storedLayout?.layout || [],
                                xxs: storedLayout?.layout || [],
                            }}
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
                            {(storedLayout?.layout || []).map(
                                (item: WidgetLayout) => (
                                    <div
                                        key={item.i}
                                        data-grid={item}
                                        className="widget-container"
                                    >
                                        <DashboardLayout
                                            key={item.i}
                                            widgetId={item.i}
                                            deviceId={item.selectedDevice || ''}
                                            chartType={item.chart || 'Line'}
                                        />
                                    </div>
                                )
                            )}
                        </ResponsiveGridLayout>
                    )}
                </Box>
                {isClicked && (
                    <AddWidget
                        onAdd={onAddWidget}
                        onClose={() => setIsClicked(false)}
                    />
                )}
            </>
        </div>
    );
};

export default Dashboard;
