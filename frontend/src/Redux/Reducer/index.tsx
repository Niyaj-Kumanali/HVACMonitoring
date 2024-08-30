import dashboardReducer from "./dashboardReducer";
import userReducer from "./Reducer";
import { combineReducers } from "redux";


const Root_Reducer = combineReducers
(
    {
        user : userReducer ,
        dashboard: dashboardReducer,
    }
)

export default Root_Reducer;


