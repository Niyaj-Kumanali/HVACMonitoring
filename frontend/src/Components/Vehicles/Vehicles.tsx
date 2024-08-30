import { useEffect, useState } from "react";
import "../Warehouse/Warehouse.css";
import CarIcon from '@mui/icons-material/DirectionsCar';
import { mongoAPI } from "../../api/MongoAPIInstance";
import { useDispatch } from "react-redux";
import { set_vehicle_count } from "../../Redux/Action/Action";

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
    // const [error, setError] = useState<{ [key: string]: string | null }>({});

    const dispatch = useDispatch();

    const fetchAllVehicles = async () => {
        try {
            const response = await mongoAPI.get("vehicle/getallvehicle");
            setAllVehicles(response.data);
            dispatch(set_vehicle_count(response.data.length))
        } catch (error) {
            console.error("Failed to fetch vehicles:", error);
        }
    };

    useEffect(() => {
        fetchAllVehicles();
    }, []);

    return (
        <div className="menu-data">
            <div className="warehouses"> {/* Renamed to warehouses to match your class name */}
                {allVehicles.map((vehicle, index) => (
                    <div className="userinfo" key={index}>
                        <div className="user-img-info">
                            <div className="img">
                                <CarIcon className="personicon" /> {/* Changed to CarIcon */}
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
    );
};

export default Vehicles;
