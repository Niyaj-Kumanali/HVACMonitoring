import { useEffect, useState } from "react";
import "./Warehouse.css";
import Loader from "../Loader/Loader";
import { getAllWarehouseByUserId, getLocationByLatsAndLongs } from "../../api/MongoAPIInstance";
import { useDispatch, useSelector } from "react-redux";
import { set_warehouse_count } from "../../Redux/Action/Action";
import { Link, useNavigate } from "react-router-dom";
import warehouseimg from "../../assets/warehouse.gif";
import { RootState } from "../../Redux/Reducer";
import Paginations from "../Pagination/Paginations";
import { Warehouse, LocationInfo } from "../../types/thingsboardTypes";



const Warehouses = () => {
    const [allWarehouses, setAllWarehouses] = useState<Warehouse[]>([]);
    const [locationInfo, setLocationInfo] = useState<{ [key: string]: LocationInfo | null }>({});
    const [loading, setLoader] = useState(true);
    const warehousecountDispatch = useDispatch();
    const [message, setMessage] = useState("");
    const currentUser = useSelector((state: RootState) => state.user.user);
    const [pageCount, setPageCount] = useState<number>(1);
    const navigate = useNavigate(); // For programmatic navigation
    const [currentpage, setCurrentpage] = useState(1);     
    const fetchAllWarehouses = async (page: any, pageSize: any) => {
        try {
            const params = {
                pageSize: pageSize,
                page: page,
              };
              console.log(params);
            const response = await getAllWarehouseByUserId(currentUser.id?.id || '', params);
            console.log(response.data);
            setTimeout(() => {
                if (response.data.data.length === 0) {
                    setMessage("No Warehouse Found");
                    warehousecountDispatch(set_warehouse_count(0));
                } else {
                    setAllWarehouses(response.data.data);
                    setPageCount(response.data.totalPages)
                    warehousecountDispatch(set_warehouse_count(response.data.totalElements));
                }
                setLoader(false);
            }, 800);
        } catch (error) {
            console.error("Failed to fetch warehouses:", error);
            setTimeout(() => {
                setMessage("Problem Fetching Warehouses");
                warehousecountDispatch(set_warehouse_count(0));
                setLoader(false);
            }, 800);
        }
    };

    useEffect(() => {
        fetchAllWarehouses(currentpage-1, 12);
    }, [currentpage]);

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

    const handleWarehouseClick = (e: React.MouseEvent, warehouse: Warehouse) => {
        e.preventDefault(); 
        navigate(`/warehouse/${warehouse.warehouse_id}`, { state: warehouse }); 
    };

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
                            <Link to={`/warehouse/${warehouse.warehouse_id}`} className="userinfo" key={warehouse._id} onClick={(e) => handleWarehouseClick(e, warehouse)}>
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
                    <Paginations pageCount={pageCount} onPageChange={setCurrentpage} />
                </div>
            </div>
        )
    );
};

export default Warehouses;
