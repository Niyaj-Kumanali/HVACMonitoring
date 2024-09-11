import { useEffect, useState } from "react";
import "../Warehouse/Warehouse.css";
import { getAllVehiclesByUserId } from "../../api/MongoAPIInstance";
import { useDispatch, useSelector } from "react-redux";
import { set_vehicle_count } from "../../Redux/Action/Action";
import VehicleLoader from "../Loader/VehicleLoader";
import { Link } from "react-router-dom";
import truckimage from "../../assets/truck.gif"
import Paginations from "../Pagination/Paginations";
import { RootState } from "../../Redux/Reducer";

interface VehicleDimensions {
    length: string;
    width: string;
    height: string;
}

interface DriverDetails {
    driver_name: string;
    driver_contact_no: string;
    licence_id: string;
}

interface VehicleData {
    vehicle_number: string;
    vehicle_name: string;
    vehicle_dimensions: VehicleDimensions;
    Driver_details: DriverDetails;
    cooling_units: string | null;
    sensors: string | null;
    vehicle_id: string;
}

const Vehicles = () => {
    const currentUser = useSelector((state: RootState)=> state.user.user)

    const [allVehicles, setAllVehicles] = useState<VehicleData[]>([]);
    const [loading, setLoading] = useState(true);
    const vehicleCountDispatch = useDispatch();
    const [message, setMessage] = useState("");

    const fetchAllVehicles = async () => {
        try {
            const response = await getAllVehiclesByUserId(currentUser.id?.id)
            if (response.data.data.length === 0) {
                vehicleCountDispatch(set_vehicle_count(0));
                setMessage("No Vehicle Found");
            } else {
                setAllVehicles(response.data.data);
                setMessage("");
                vehicleCountDispatch(set_vehicle_count(response.data.data.length));
            }
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        } catch (error) {
            console.error("Failed to fetch vehicles:", error);
            vehicleCountDispatch(set_vehicle_count(0));
            setMessage("Failed to fetch vehicles");
            setTimeout(() => {
                setLoading(false);
            }, 500);
        }
    };


    useEffect(() => {
        fetchAllVehicles();
    }, []);

    return (
        loading ? (
            <VehicleLoader />
        ) : allVehicles.length === 0 ? (
            <div className="menu-data">{message}</div>
        ) : (
            <div className="menu-data">
                <div className="warehouses-cont">
                    <div className="warehouses">
                        {allVehicles.map((vehicle, index) => (
                            <Link className="userinfo" key={index} to={`/vehicle/${vehicle.vehicle_id}`}>
                                <div className="user-img-info">
                                    <div className="img">
                                        <img src={truckimage} className="personicon" alt="Truck Icon" />
                                    </div>
                                    <div className="status">
                                        <p className="username">{vehicle.vehicle_name}</p>
                                        <p>{vehicle.vehicle_number}</p>
                                        <p className="driver-name">Driver: {vehicle.Driver_details.driver_name}</p>
                                        <p className="driver-contact">Contact: {vehicle.Driver_details.driver_contact_no}</p>
                                        <p className="licence-id">Licence ID: {vehicle.Driver_details.licence_id}</p>
                                        <p className="cooling-units">Cooling Units: {vehicle.cooling_units || "N/A"}</p>
                                        <p className="sensors">Sensors: {vehicle.sensors || "N/A"}</p>
                                    </div>
                                </div>

                            </Link>
                        ))}
                    </div>
                    <Paginations/>
                </div>
            </div>
        )
    );
};

export default Vehicles;
