import { useEffect, useState } from "react";
import "./Warehouse.css";
import Loader from "../Loader/Loader";
import { getAllWarehouseByUserId, getLocationByLatsAndLongs } from "../../api/MongoAPIInstance";
import { useDispatch, useSelector } from "react-redux";
import { set_warehouse_count } from "../../Redux/Action/Action";
import { Link } from "react-router-dom";
import warehouseimg from "../../assets/warehouse.gif"
import Paginations from "../Pagination/Paginations";
import { RootState } from "../../Redux/Reducer";



interface Warehouse {
    _id: string;
    warehouse_id: string;
    warehouse_name: string;
    location: string;
    latitude: string;
    longitude: string;
    userId: string;
    email: string
}

interface LocationInfo {
    display_name: string;
}

const Warehouses = () => {
    const [allWarehouses, setAllWarehouses] = useState<Warehouse[]>([]);
    const [locationInfo, setLocationInfo] = useState<{ [key: string]: LocationInfo | null }>({});
    const [loading, setLoader] = useState(true);
    const warehousecountDispatch = useDispatch();
    const [message, setMessage] = useState("");
    const currentUser = useSelector((state: RootState) => state.user.user)


    const fetchAllWarehouses = async () => {
        try {
            const response = await getAllWarehouseByUserId(currentUser.id?.id || '');
            console.log(response)
            setTimeout(() => {
                if (response.data.length === 0) {
                    setMessage("No Warehouse Found");
                    warehousecountDispatch(set_warehouse_count(0));
                } else {
                    setAllWarehouses(response.data.data);
                    warehousecountDispatch(set_warehouse_count(response.data.data.length));
                }
                setLoader(false);
            }, 800)
            
        } catch (error) {
            console.error("Failed to fetch warehouses:", error);
            setTimeout(() => {
                setMessage("Problem Fetching Warehouses");
                warehousecountDispatch(set_warehouse_count(0));
                setLoader(false);
            }, 800)
        }
    };

    useEffect(() => {
        fetchAllWarehouses();
    }, []);

    useEffect(() => {
        const fetchLocationInfo = async (latitude: string, longitude: string, warehouseId: string) => {
            try {
                const response = await getLocationByLatsAndLongs(latitude, longitude);
                if (!response.ok) {
                    throw new Error('Failed to fetch location data');
                }

                const data: LocationInfo = await response.json();
                setLocationInfo(prevState => ({ ...prevState, [warehouseId]: data }));
            } catch (err: any) {
                console.log(`Error fetching location for warehouse ${warehouseId}:`, err.message);
            }
        };

        allWarehouses.forEach(warehouse => {
            if (warehouse.latitude && warehouse.longitude) {
                fetchLocationInfo(warehouse.latitude, warehouse.longitude, warehouse._id);
            }
        });
    }, [allWarehouses]);

    return (
        loading ? (
            <Loader />
        ) : allWarehouses.length === 0 ? (
            <div className="menu-data">{message}</div>
        ) : (
            <div className="menu-data">
                        <div className="warehouses-cont">
                    <div className="warehouses">
                        {allWarehouses.map((warehouse) => (
                            <Link to={`/warehouse/${warehouse.warehouse_id}`} className="userinfo" key={warehouse._id}>
                                <div className="user-img-info">
                                    <div className="img">
                                        <img src={warehouseimg} className="personicon" />
                                    </div>
                                    <div className="status">
                                        <p className="username">{warehouse.warehouse_name}</p>
                                        <p>{warehouse.warehouse_id}</p>
                                        <p className="location">{locationInfo[warehouse._id]?.display_name || "Loading location..."}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <Paginations />
                </div>
            </div>
        )
    );
};

export default Warehouses;
