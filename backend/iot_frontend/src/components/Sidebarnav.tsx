
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';
import '../App.css';

const Sidebarnav = () => {
  return (
    <Sidebar className="custom-sidebar">
      <Menu
        menuItemStyles={{
          button: {
            [`&.active`]: {
              backgroundColor: 'red',
              color: 'green',
            },
          },
        }}
      >
        <SubMenu label="Add Devices">
          <MenuItem component={<Link to="/addsensor">Add Sensor</Link>}>Add Sensor</MenuItem>
          <MenuItem component={<Link to="/addcoolant">Add Coolant</Link>}>Add Coolant</MenuItem>
        </SubMenu>
        <MenuItem component={<Link to="/addwarehouse">Add Warehouse</Link>}>Add Warehouse</MenuItem>
        <MenuItem component={<Link to="/addvehicle">Add Vehicle</Link>}>Add Vehicle</MenuItem>
        
        <SubMenu label="Sensors">
          <MenuItem component={<Link to="/allsensor">1</Link>}>All Sensor</MenuItem>
          <MenuItem component={<Link to="/avaliablesensors">2</Link>}>Avaliable Sensors</MenuItem>
        </SubMenu>
        <SubMenu label="Coolants">
          <MenuItem component={<Link to="/allcoolants">3</Link>}>All Coolants</MenuItem>
          <MenuItem component={<Link to="/avaliablecoolants">4</Link>}>Avaliable Coolants</MenuItem>
        </SubMenu>
        <MenuItem component={<Link to="/allwarehouses">Add Warehouse</Link>}>Warehouses</MenuItem>
        <MenuItem component={<Link to="/sensorform">Sensor Form</Link>}>SensorForm</MenuItem>
        <MenuItem component={<Link to="/coolantform">Coolant Form</Link>}>CoolantForm</MenuItem>
        <MenuItem>Test</MenuItem>
        <MenuItem>Test</MenuItem>
        <MenuItem>Test</MenuItem>
        <MenuItem>Test</MenuItem>
        <MenuItem>Test</MenuItem>
        <MenuItem>Test</MenuItem>
        <MenuItem>Test</MenuItem>
        <MenuItem>Test</MenuItem>
        <MenuItem>Test</MenuItem>
        <MenuItem>Test</MenuItem>
        <MenuItem>Test</MenuItem>
        <MenuItem>Test</MenuItem>
        <MenuItem>Test</MenuItem>
        <MenuItem>Test</MenuItem>
        <MenuItem>Test</MenuItem>

      </Menu>
    </Sidebar>
  );
};

export default Sidebarnav;
