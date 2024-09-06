
import { Layout } from 'react-grid-layout';
import { SET_LAYOUT } from '../Action/layoutActions';

interface LayoutState {
  layout: Layout[];
}

const initialState: LayoutState = {
  layout: [],
};

const layoutReducer = (state = initialState, action: any): LayoutState => {
  switch (action.type) {
    case SET_LAYOUT:
      return {
        ...state,
        layout: action.payload,
      };
    default:
      return state;
  }
};

export default layoutReducer;
