// RouterComponent.js

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebarnav from './Sidebarnav';  // Adjust the path as needed
import AddWarehouse from './AddWarehouse';
import AddSensor from './AddSensor';
import AddCoolant from './AddCoolant';
import AddVehicle from './AddVehicle';
import AllCoolants from './AllCoolants';
import AvaliableCoolants from './AvaliableCoolants';
import AllSensors from './AllSensors';
import AvaliableSensors from './AvaliableSensors';
import AllWarehouses from './AllWarehouses';
import SensorForm from './SensorForm';
import CoolantForm from './CoolantForm';

const Home = () => <h1>Welcome to Home</h1>;

const RouterComponent = () => {
  return (
    <Router>
      <div className='rou'>
        <div>
            <Sidebarnav />
        </div>
        <div className="page-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/addsensor" element={<AddSensor />} />
            <Route path="/addcoolant" element={<AddCoolant />} />
            <Route path="/addwarehouse" element={<AddWarehouse />} />
            <Route path="/addvehicle" element={<AddVehicle />} />
            <Route path="/allcoolants" element={<AllCoolants />} />
            <Route path="/avaliablecoolants" element={<AvaliableCoolants />} />
            <Route path="/allsensor" element={<AllSensors />} />
            <Route path="/avaliablesensors" element={<AvaliableSensors />} />
            <Route path="/allwarehouses" element={<AllWarehouses />} />
            <Route path="/sensorform" element={<SensorForm />} />
            <Route path="/coolantform" element={<CoolantForm />} />
            
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default RouterComponent;
