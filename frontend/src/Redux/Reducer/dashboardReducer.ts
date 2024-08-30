// import { User } from "../../types/thingsboardTypes";

interface Userstate {
  accesstoken: string | null;
}
const initial_state: any = {
  devices: [],
  sensors: [],
  selectedDevice: '',
  selectedSensors: [],
};

const dashboardReducer = (state = initial_state, action: any): Userstate => {
  switch (action.type) {
    case 'SET_DEVICES':
      return {
        ...state,
        devices: action.payload,
      };
    default:
      return state;
  }
};

export default dashboardReducer;
