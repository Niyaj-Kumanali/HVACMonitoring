import layoutReducer from './layoutReducer';
import userReducer from './Reducer';
import { combineReducers } from 'redux';

const rootReducer  = combineReducers({
  user: userReducer,
  layout: layoutReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer ;
