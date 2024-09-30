import { createBrowserRouter } from 'react-router-dom';
import Dashboards from './Components/Dashboards/Dashboards';
import Charts from './Components/Charts/Charts';
import Actions from './Components/Actions/Actions';
import Devices from './Components/Devices/Devices';
import Locations from './Components/Locations/Locations';
import Users from './Components/Users/Users';
import AddDevice from './Components/Add-Devices/AddDevice';
import Warehouses from './Components/Warehouse/Warehouses';
import Vehicles from './Components/Vehicles/Vehicles';
import AddAction from './Components/Add-Action/AddAction';
import AddLocation from './Components/Add-Location/AddLocation';
import Addwarehouse from './Components/Add-Warehouse/Addwarehouse';
import Addvehicle from './Components/Add-Vehicle/Addvehicle';
import MyComponent from './Components/MyComponent/MyComponent';
import Login from './Components/Login/Login';
import Accountinfo from './Components/AccountInfo/Accountinfo';
import Dashboard from './Components/Dashboard/Dashboard';
import App from './App';
import PageNotFound from './Components/PageNotFound/PageNotFound';
import AddSupervisor from './Components/Add-User/AddSupervisor';
import AddCustomer from './Components/Add-User/AddCustomer';
import DeviceInfo from './Components/DeviceInfo/DeviceInfo';
import User from './Components/Users/user';
import Warehouse from './Components/Warehouse/Warehouse';
import Signup from './Components/Login/Signup';
import Vehicleinfo from './Components/Vehicles/Vehicleinfo';
import AddDashboard from './Components/Add-Dashboard/AddDashboard';
import ResetPassword from './Components/ResetPassword/ResetPassword';
import AddRooms from './Components/Warehouse/AddRooms';
import AddDgSet from './Components/AddDGSet/AddDgSet';
import AddGrid from './Components/AddGrid/AddGrid';

const Router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },

  {
    path: '/login/resetpassword',
    element: <ResetPassword />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/dashboards',
        element: <Dashboards />,
      },
      {
        path: '/dashboard/:dashboardId',
        element: <Dashboard />,
      },
      {
        path: '/charts',
        element: <Charts />,
      },
      {
        path: '/actions',
        element: <Actions />,
      },
      {
        path: '/devices',
        element: <Devices />,
      },
      {
        path: '/device/:deviceId',
        element: <DeviceInfo />,
      },
      {
        path: '/locations',
        element: <Locations />,
      },
      {
        path: '/users',
        element: <Users />,
      },
      {
        path: '/addDevice',
        element: <AddDevice />,
      },
      {
        path: '/dashboard',
        element: <AddDashboard />,
      },
      {
        path: 'dashboard/edit/:dashboardId',
        element: <AddDashboard />,
      },

      {
        path: '/warehouses',
        element: <Warehouses />,
      },
      {
        path: '/vehicles',
        element: <Vehicles />,
      },
      {
        path: '/addAction',
        element: <AddAction />,
      },
      {
        path: '/addLocation',
        element: <AddLocation />,
      },
      {
        path: '/addWarehouse',
        element: <Addwarehouse />,
      },
      {
        path: '/addCustomer',
        element: <AddCustomer />,
      },
      {
        path: '/addVehicle',
        element: <Addvehicle />,
      },
      {
        path: '/testComponent',
        element: <MyComponent />,
      },
      {
        path: '/accountinfo',
        element: <Accountinfo />,
      },
      {
        path: '/addSupervisor',
        element: <AddSupervisor />,
      },
      {
        path: '/user/:email',
        element: <User />,
      },
      {
        path: '/warehouse/:warehouseid',
        element: <Warehouse />,
      },
      {
        path: '/vehicle/:vehicleid',
        element: <Vehicleinfo />,
      },
      {
        path: '/addRoom',
        element: <AddRooms />,
      },
      {
        path: '/addDgset',
        element: <AddDgSet />,
      },
      {
        path: '/addGrid',
        element: <AddGrid />,
      }
    ],
  },
  {
    path: '*', 
    element: <PageNotFound />,
  },
]);

export default Router;
