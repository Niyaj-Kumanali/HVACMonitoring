import "./Menubar.css";
import SpeedIcon from '@mui/icons-material/Speed';
import PieChartIcon from '@mui/icons-material/PieChart';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import CableIcon from '@mui/icons-material/Cable';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import GroupIcon from '@mui/icons-material/Group';
import { Link, useNavigate } from "react-router-dom";
import AddToQueueIcon from '@mui/icons-material/AddToQueue';
import AddIcon from '@mui/icons-material/Add';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { set_Menubaropen } from "../../Redux/Action/Action";
import { RootState } from "../../Redux/Reducer";

const Menubar = () => {
    const deviceCount = useSelector((state: any) => state.user.deviceCount);
    const userCount = useSelector((state: any) => state.user.userCount);
    const warehousecount = useSelector((state: any) => state.user.warehouseCount);
    const currentuser = useSelector((state: any) => state.user.authority);
    const vehicleCount = useSelector((state: any) => state.user.vehicleCount);
    const menubaropen = useSelector((state: any) => state.user.menubar);
    const [className, setClassName] = useState(getClassName(window.innerWidth));
    const hideref = useRef<HTMLDivElement>(null);
    const userSelectionRef = useRef<HTMLDivElement>(null);
    const menubarRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();  // useNavigate to programmatically navigate

    const isMenubar = useSelector((state: RootState) => state.user.menubar)
    const [isUserSelectionOpen, setIsUserSelectionOpen] = useState(isMenubar || false);

    console.log(menubaropen)

    function getClassName(width: number) {
        return width <= 700 ? 'sidebar2' : 'side-bar';
    }

    const handleResize = () => {
        const width = window.innerWidth;
        setClassName(getClassName(width));

        if (width <= 700 && menubaropen) {
            dispatch(set_Menubaropen(false));
        }
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [menubaropen]);

    // useEffect(() => {
    //     const handleClickOutside = (event: MouseEvent) => {
    //         if (menubarRef.current && !menubarRef.current.contains(event.target as Node)) {
    //             if (menubaropen) {
    //                 dispatch(set_Menubaropen(false));  // Close the sidebar
    //             }
    //         }
    //     };

    //     document.addEventListener('mousedown', handleClickOutside);  // Add the listener globally

    //     return () => document.removeEventListener('mousedown', handleClickOutside);  // Cleanup the listener on component unmount
    // }, [menubaropen, dispatch]);


    const handleLinkClick = (path: string) => {
        dispatch(set_Menubaropen(false));
        navigate(path);
    };


    return (
        <div className={`${className}`} id={`${menubaropen ? "side-bar" : ""}`} ref={menubarRef}>
            <div className="Menu">
                <p>Menu</p>
            </div>
            <ul>
                <li onClick={() => handleLinkClick('/dashboards')}>
                    <SpeedIcon className="speedicon" />Dashboards
                </li>
                <li onClick={() => handleLinkClick('/charts')}>
                    <PieChartIcon className="speedicon" />Charts
                </li>
                <li onClick={() => handleLinkClick('/actions')}>
                    <ElectricBoltIcon className="speedicon" />Actions <span className="count">3</span>
                </li>
                {currentuser === 'TENANT_ADMIN' && (
                    <li onClick={() => handleLinkClick('/devices')}>
                        <CableIcon className="speedicon" />Devices <span className="count">{deviceCount}</span>
                    </li>
                )}
                <li onClick={() => handleLinkClick('/locations')}>
                    <LocationOnIcon className="speedicon" />Locations <span className="count">10.67K</span>
                </li>
                <li onClick={() => handleLinkClick('/warehouses')}>
                    <WarehouseIcon className="speedicon" />Warehouses <span className="count">{warehousecount}</span>
                </li>
                <li onClick={() => handleLinkClick('/vehicles')}>
                    <LocalShippingIcon className="speedicon" />Vehicles <span className="count">{vehicleCount}</span>
                </li>
                <li onClick={() => handleLinkClick('/users')}>
                    <GroupIcon className="speedicon" />Users <span className="count">{userCount}</span>
                </li>
                <li className="quick-action">Quick Actions</li>
                <div ref={hideref}>
                    <li onClick={() => handleLinkClick('/addDevice')}>
                        <AddToQueueIcon className="speedicon" />Add Device
                    </li>
                    <li onClick={() => handleLinkClick('/addAction')}>
                        <AddIcon className="speedicon" />Add Action
                    </li>
                    <li onClick={() => handleLinkClick('/addWarehouse')}>
                        <AddIcon className="speedicon" />Add Warehouse
                    </li>
                    <li onClick={() => handleLinkClick('/addVehicle')}>
                        <AddIcon className="speedicon" />Add Vehicle
                    </li>
                    <div className="link add-user-link" onClick={() => setIsUserSelectionOpen(!isUserSelectionOpen)}>
                        <li><PersonAddAlt1Icon className="speedicon" />Add User</li>
                        <div className={`user-selection ${isUserSelectionOpen ? 'toggle-user-open' : 'toggle-user'}`} ref={userSelectionRef}>
                            <li onClick={() => handleLinkClick('/addSupervisor')}>Add Supervisor</li>
                            <li onClick={() => handleLinkClick('/addCustomer')}>Add Customer</li>
                        </div>
                    </div>
                </div>
                <li onClick={() => handleLinkClick('/testComponent')}>
                    <PersonAddAlt1Icon className="speedicon" />My Component
                </li>
            </ul>
        </div>
    );
};

export default Menubar;
