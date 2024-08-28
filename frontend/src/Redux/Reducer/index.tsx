import userReducer from "./Reducer";
import { combineReducers } from "redux";


const Root_Reducer = combineReducers
(
    {
        user : userReducer ,
    }
)

export default Root_Reducer;


