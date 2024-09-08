// src/redux/reducers/layoutReducer.ts
import { SET_LAYOUT } from '../Action/layoutActions';
import { chartTypes, WidgetLayout } from '../../types/thingsboardTypes';
export interface DashboardLayoutOptions {
  layout: WidgetLayout[];
  dateRange: {
    startDate: any,
    endDate: any
  };
  defaultDevice: string;
  limit: number;
  chart: chartTypes;
}

export interface LayoutState {
  [dashboardId: string]: DashboardLayoutOptions; // Store layouts based on dashboardId
}

const initialState: LayoutState = {};

const layoutReducer = (state = initialState, action: any): LayoutState => {
  switch (action.type) {
    case SET_LAYOUT:
      return {
        ...state,
        [action.payload.dashboardId]: {
          ...action.payload.layout, // Directly updating the entire DashboardLayoutOptions
        },
      };
    default:
      return state;
  }
};

export default layoutReducer;
