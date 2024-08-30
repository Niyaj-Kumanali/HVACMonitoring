import { useEffect, useState } from "react";
import "../Warehouse/Warehouse.css";
import { mongoAPI } from "../../api/MongoAPIInstance";
import { useDispatch } from "react-redux";
import { set_vehicle_count } from "../../Redux/Action/Action";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import Loader from '../Loader/Loader';
import { getCurrentUser } from "../../api/loginApi";

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
}

const Vehicles = () => {

    const [allVehicles, setAllVehicles] = useState<VehicleData[]>([]);
    const [loading, setLoading] = useState(true);
    const vehicleCountDispatch = useDispatch();

    const fetchAllVehicles = async () => {
        try {
            const currentUser = await getCurrentUser()
            const response = await mongoAPI.get(`vehicle/getallvehicle/${currentUser.id.id}`);
            setAllVehicles(response.data);
            vehicleCountDispatch(set_vehicle_count(response.data.length));
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        } catch (error) {
            console.error("Failed to fetch vehicles:", error);
        }
    };

    useEffect(() => {
        fetchAllVehicles();
    }, []);

    return (
        loading ? (
            <Loader />
        ) : (
            <div className="menu-data">
                <div className="warehouses">
                    {allVehicles.map((vehicle, index) => (
                        <div className="userinfo" key={index}>
                            <div className="user-img-info">
                                <div className="img">
                                    <LocalShippingIcon className="personicon" />
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
                        </div>
                    ))}
                </div>
            </div>
        )
    );
};

export default Vehicles;
