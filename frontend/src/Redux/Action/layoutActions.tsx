import { DashboardLayoutOptions } from "../Reducer/layoutReducer";

export const SET_LAYOUT = 'SET_LAYOUT';

export const setLayout = (dashboardId: string = "", layout: DashboardLayoutOptions) => ({
  type: SET_LAYOUT,
  payload: { dashboardId, layout },
});
