import "./Menubar.css";
import SpeedIcon from '@mui/icons-material/Speed';
import PieChartIcon from '@mui/icons-material/PieChart';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import CableIcon from '@mui/icons-material/Cable';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import GroupIcon from '@mui/icons-material/Group';
import { Link } from "react-router-dom";
import AddToQueueIcon from '@mui/icons-material/AddToQueue';
import AddIcon from '@mui/icons-material/Add';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

const Menubar = () => {
    const deviceCount = useSelector((state: any) => state.user.deviceCount);
    const userCount = useSelector((state: any) => state.user.userCount);
    const warehousecount = useSelector((state: any) => state.user.warehouseCount);
    const currentuser = useSelector((state: any) => state.user.authority);
    const vehicleCount = useSelector((state: any) => state.user.vehicleCount);

    const hideref = useRef<HTMLDivElement>(null);
    const userSelectionRef = useRef<HTMLDivElement>(null);
    const [isUserSelectionOpen, setIsUserSelectionOpen] = useState(false);


    useEffect(() => {
        if (hideref.current) {
            if (currentuser === "CUSTOMER_USER") {
                hideref.current.style.display = "none";
            } else {
                hideref.current.style.display = "block";
            }
        }

        document.body.style.overflowX = 'hidden';
        return () => {
            document.body.style.overflowX = '';
        };
    }, [currentuser]);

    const handleUserSelectionOpen = () => {
        setIsUserSelectionOpen(prevState => !prevState);
    };

    return (
        <div className="side-bar">
            <div className="Menu">
                <p>Menu</p>
            </div>
            <ul>
                <Link to="/dashboards" className="link">
                    <li><SpeedIcon className="speedicon" />Dashboards</li>
                </Link>
                <Link to="/charts" className="link">
                    <li><PieChartIcon className="speedicon" />Charts</li>
                </Link>
                <Link to="/actions" className="link">
                    <li><ElectricBoltIcon className="speedicon" />Actions <span className="count">3</span></li>
                </Link>
                {currentuser == 'TENANT_ADMIN' && <Link to="/devices" className="link">
                    <li><CableIcon className="speedicon" />Devices <span className="count">{deviceCount}</span></li>
                </Link>}
                <Link to="/locations" className="link">
                    <li><LocationOnIcon className="speedicon" />Locations <span className="count">3</span></li>
                </Link>
                <Link to="/warehouses" className="link">
                    <li><WarehouseIcon className="speedicon" />Warehouses <span className="count">{warehousecount}</span></li>
                </Link>
                <Link to="/vehicles" className="link">
                    <li><LocalShippingIcon className="speedicon" />Vehicles <span className="count">{vehicleCount}</span></li>
                </Link>
                <Link to="/users" className="link">
                    <li><GroupIcon className="speedicon" />Users <span className="count">{userCount}</span></li>
                </Link>
                <li className="quick-action">Quick Actions</li>
                <div ref={hideref}>
                    <Link to="/addDevice" className="link">
                        <li><AddToQueueIcon className="speedicon" />Add Device</li>
                    </Link>
                    <Link to="/addAction" className="link">
                        <li><AddIcon className="speedicon" />Add Action</li>
                    </Link>
                    <Link to="/addWarehouse" className="link">
                        <li><AddIcon className="speedicon" />Add Warehouse</li>
                    </Link>
                    <Link to="/addVehicle" className="link">
                        <li><AddIcon className="speedicon" />Add Vehicle</li>
                    </Link>
                    <div className="link add-user-link" onClick={handleUserSelectionOpen}>
                        <li><PersonAddAlt1Icon className="speedicon" />Add User</li>
                        <div
                            className={`user-selection ${isUserSelectionOpen ? 'toggle-user-open' : 'toggle-user'}`}
                            ref={userSelectionRef}
                        >
                            <Link to="/addSupervisor" className="user-selection-link">Add Supervisor</Link>
                            <Link to="/addCustomer" className="user-selection-link">Add Customer</Link>
                        </div>
                    </div>
                </div>
                <Link to="/testComponent" className="link">
                    <li><PersonAddAlt1Icon className="speedicon" />My Component</li>
                </Link>
            </ul>
        </div>
    );
};

export default Menubar;
