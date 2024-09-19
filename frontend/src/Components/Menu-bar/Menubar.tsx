import "./Menubar.css";
import SpeedIcon from '@mui/icons-material/Speed';
import PieChartIcon from '@mui/icons-material/PieChart';
// import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import CableIcon from '@mui/icons-material/Cable';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import GroupIcon from '@mui/icons-material/Group';
import { useNavigate } from "react-router-dom";
import AddToQueueIcon from '@mui/icons-material/AddToQueue';
import AddIcon from '@mui/icons-material/Add';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { useDispatch, useSelector } from "react-redux";
import { set_Menubaropen } from "../../Redux/Action/Action";
import { RootState } from "../../Redux/Reducer";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useEffect, useRef, useState } from "react";
import { formatNumber } from "../../Utility/utility_functions";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

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
    const navigate = useNavigate();
    const isMenubar = useSelector((state: RootState) => state.user.menubar)
    const [isUserSelectionOpen, setIsUserSelectionOpen] = useState(isMenubar || false);

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
    }, [menubaropen, dispatch]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menubarRef.current && !menubarRef.current.contains(event.target as Node)) {
                if (menubaropen) {
                    dispatch(set_Menubaropen(false));
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [menubaropen]);


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
                {/* <li onClick={() => handleLinkClick('/actions')}>
                    <ElectricBoltIcon className="speedicon" />Actions <span className="count">{formatNumber(3)}</span>
                </li> */}
                {currentuser === 'TENANT_ADMIN' && (
                    <li onClick={() => handleLinkClick('/devices')}>
                        <CableIcon className="speedicon" />Devices <span className="count">{formatNumber(deviceCount)}</span>
                    </li>
                )}
                <li onClick={() => handleLinkClick('/locations')}>
                    <LocationOnIcon className="speedicon" />Locations <span className="count">{formatNumber(warehousecount)}</span>
                </li>
                <li onClick={() => handleLinkClick('/warehouses')}>
                    <WarehouseIcon className="speedicon" />Warehouses <span className="count">{formatNumber(warehousecount)}</span>
                </li>
                <li onClick={() => handleLinkClick('/vehicles')}>
                    <LocalShippingIcon className="speedicon" />Vehicles <span className="count">{formatNumber(vehicleCount)}</span>
                </li>
                <li onClick={() => handleLinkClick('/users')}>
                    <GroupIcon className="speedicon" />Users <span className="count">{formatNumber(userCount)}</span>
                </li>

                <div className="quick-action">Quick Actions</div>
                <div className="link add-user-link" onClick={() => setIsUserSelectionOpen(!isUserSelectionOpen)}>
                    <li><PersonAddAlt1Icon className="speedicon" />Add User {!isUserSelectionOpen ? <KeyboardArrowDownIcon className="arrow-down" /> : <KeyboardArrowUpIcon className="arrow-down" />}</li>
                    <div className={`user-selection ${isUserSelectionOpen ? 'toggle-user-open' : 'toggle-user'}`} ref={userSelectionRef}>
                        <li onClick={() => handleLinkClick('/addSupervisor')}>Add Supervisor</li>
                        <li onClick={() => handleLinkClick('/addCustomer')}>Add Customer</li>
                    </div>
                </div>
                <div ref={hideref}>
                    <li onClick={() => handleLinkClick('/addDevice')}>
                        <AddToQueueIcon className="speedicon" />Add Device
                    </li>
                    {/* <li onClick={() => handleLinkClick('/addAction')}>
                        <AddIcon className="speedicon" />Add Action
                    </li> */}
                    <li onClick={() => handleLinkClick('/addWarehouse')}>
                        <AddIcon className="speedicon" />Add Warehouse
                    </li>
                    <li onClick={() => handleLinkClick('/addVehicle')}>
                        <AddIcon className="speedicon" />Add Vehicle
                    </li>
                </div>
                <li onClick={() => handleLinkClick('/testComponent')}>
                    <PersonAddAlt1Icon className="speedicon" />My Component
                </li>
            </ul>
        </div>
    );
};

export default Menubar;
