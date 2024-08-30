import { useEffect, useState } from "react";
import "./Warehouse.css";
import WarehouseIcon from '@mui/icons-material/Warehouse';
import { getCurrentUser } from "../../api/loginApi";
import Loader from "../Loader/Loader";
import { mongoAPI } from "../../api/MongoAPIInstance";


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

const Warehouse = () => {
    const [allWarehouses, setAllWarehouses] = useState<Warehouse[]>([]);
    const [locationInfo, setLocationInfo] = useState<{ [key: string]: LocationInfo | null }>({});
    // const [error, setError] = useState<{ [key: string]: string | null }>({});
    const [loading, setLoader] = useState(true)


    const fetchAllWarehouses = async () => {
        try {
            const currentUser = await getCurrentUser()
            console.log(currentUser.id.id)

            const response = await mongoAPI.get(`/warehouse/getallwarehouse/${currentUser.id.id}`)

            setAllWarehouses(response.data);
            setTimeout(() => {
                setLoader(false);
            }, 500);
        } catch (error) {
            console.error("Failed to fetch warehouses:", error);
        }
    };

    useEffect(() => {
        fetchAllWarehouses();
    }, []);

    useEffect(() => {
        const fetchLocationInfo = async (latitude: string, longitude: string, warehouseId: string) => {
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch location data');
                }

                const data: LocationInfo = await response.json();
                setLocationInfo(prevState => ({ ...prevState, [warehouseId]: data }));
            } catch (err: any) {
                // setError(prevState => ({ ...prevState, [warehouseId]: err.message }));
                console.log(err)
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
            <Loader/>
        ) : (
            <>
                <div className="menu-data">
                    <div className="warehouses">
                        {allWarehouses.map((warehouse) => (
                            <div className="userinfo" key={warehouse._id}>
                                <div className="user-img-info">
                                    <div className="img">
                                        <WarehouseIcon className="personicon" />
                                    </div>
                                    <div className="status">
                                        <p className="username">{warehouse.warehouse_name}</p>
                                        <p>{warehouse.warehouse_id}</p>
                                        <p className="location">{locationInfo[warehouse._id]?.display_name || "Loading location..."}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </>
        )
    );
};

export default Warehouse;
