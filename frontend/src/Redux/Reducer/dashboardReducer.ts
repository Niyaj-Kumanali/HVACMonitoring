// Define the type for a single dashboard
interface Dashboard {
  id: string;
  selectedcharts: Object;
}

// Define the type for the state
interface DashboardState {
  dashboards: { [id: string]: Dashboard };
}

// Define the initial state
const initial_state: DashboardState = {
  dashboards: {}
};

// Reducer function
const dashboardReducer = (state = initial_state, action: any): DashboardState => {
  switch (action.type) {
    case 'SET_DASHBOARD':
      // Assuming action.payload is an object where keys are dashboard IDs and values are dashboard objects
      return {
        ...state,
        dashboards: {
          ...state.dashboards,
          ...action.payload
        }
      };
    default:
      return state;
  }
};

export default dashboardReducer;