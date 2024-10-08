import { createBrowserRouter } from 'react-router-dom';
import Dashboards from './Components/Dashboards/Dashboards';
import Charts from './Components/Charts/Charts';
import Devices from './Components/Devices/Devices';
import Locations from './Components/Locations/Locations';
import Users from './Components/Users/Users';
import AddDevice from './Components/Add-Devices/AddDevice';
import Warehouses from './Components/Warehouse/Warehouses';
import Vehicles from './Components/Vehicles/Vehicles';
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
import AddWarehouse from './Components/Add-Warehouse/Addwarehouse';
import EditWarehouse from './Components/Warehouse/EditWarehouse';
import EditVehicle from './Components/Vehicles/EditVehicle';
import EditDevice from './Components/Devices/EditDevice';
import EditUser from './Components/Users/EditUser';
import AddRefrigerator from './Components/AddRefrigerator/AddRefrigeratoe';

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
                path: '/addCustomer',
                element: <AddCustomer />,
            },
            {
                path: '/vehicle',
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
                path: '/user/:emailid',
                element: <User />,
            },
            {
                path: '/warehouse/:warehouseid',
                element: <Warehouse />,
            },
            {
                path: '/warehouse',
                element: <AddWarehouse />,
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
            },
            {
                path: '/refrigerator',
                element: <AddRefrigerator />,
            },
            {
                path: '/Editwarehouse/:warehouseid',
                element: <EditWarehouse />,
            },
            {
                path: '/Editvehicle/:vehicleid',
                element: <EditVehicle />,
            },
            {
                path: '/editDevice/:deviceid',
                element: <EditDevice />,
            },
            {
                path:'/editUser/:emailid',
                element: <EditUser />,
            }
        ],
    },
    {
        path: '*',
        element: <PageNotFound />,
    },
]);

export default Router;
