// src/redux/reducers/layoutReducer.ts
import { Layout } from 'react-grid-layout';
import { SET_LAYOUT } from '../Action/layoutActions';

interface LayoutState {
  [dashboardId: string]: Layout[]; // Store layouts based on dashboardId
}

const initialState: LayoutState = {};

const layoutReducer = (state = initialState, action: any): LayoutState => {
  switch (action.type) {
    case SET_LAYOUT:
      return {
        ...state,
        [action.payload.dashboardId]: action.payload.layout,
      };
    default:
      return state;
  }
};

export default layoutReducer;
