import { useEffect, useState } from "react";
import "./Locations.css";
import { getCurrentUser } from "../../api/loginApi";
import { mongoAPI } from "../../api/MongoAPIInstance";
import warehouseimg from "../../assets/warehouse.gif"

interface Warehouse {
    latitude: string;
    longitude: string;
}

interface LocationInfo {
    display_name: string;
}

const Locations = () => {
    const [locationInfo, setLocationInfo] = useState<{ [key: string]: LocationInfo | null }>({});
    const [loading, setLoader] = useState(true);
    const [uniqueLocations, setUniqueLocations] = useState<{ latitude: string; longitude: string }[]>([]);

    // Fetch all warehouses
    const fetchAllWarehouses = async () => {
        try {
            const currentUser = await getCurrentUser(); // Fetch the current user
            const response = await mongoAPI.get(`/warehouse/getallwarehouse/${currentUser.data.id.id}`);

            // Filter for unique locations by comparing latitude and longitude
            const uniqueLocations = response.data.reduce((acc: { latitude: string; longitude: string }[], warehouse: Warehouse) => {
                const isLocationUnique = !acc.some(
                    (location) => location.latitude === warehouse.latitude && location.longitude === warehouse.longitude
                );
                if (isLocationUnique) {
                    acc.push({ latitude: warehouse.latitude, longitude: warehouse.longitude });
                }
                return acc;
            }, []);

            setUniqueLocations(uniqueLocations); // Set unique locations

            // Dispatch the warehouse count to Redux
            setLoader(false);
        } catch (error) {
            console.error("Failed to fetch warehouses:", error);
            setLoader(false);
        }
    };

    // Fetch location info for each unique location
    useEffect(() => {
        const fetchLocationInfo = async (latitude: string, longitude: string) => {
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch location data");
                }

                const data: LocationInfo = await response.json();
                setLocationInfo((prevState) => ({ ...prevState, [`${latitude},${longitude}`]: data }));
            } catch (err: any) {
                console.log(`Error fetching location for coordinates ${latitude}, ${longitude}:`, err.message);
            }
        };

        // Iterate over uniqueLocations and fetch location info
        uniqueLocations.forEach((location) => {
            fetchLocationInfo(location.latitude, location.longitude);
        });
    }, [uniqueLocations]); // This effect runs when `uniqueLocations` changes

    // Fetch warehouses on component mount
    useEffect(() => {
        fetchAllWarehouses();
    }, []);

    return (
        <div className="menu-data">
            {loading ? (
                <p>Loading locations...</p>
            ) : (
                <div className="warehouses">
                    <h1>Locations of warehouses</h1>
                    {uniqueLocations.map((location, index) => (
                        <div className="user-img-info" key={index}>
                            <div className="img">
                                    <img src={warehouseimg} className="personicon" />
                                </div>
                            <div className="status">
                                <p className="location">{locationInfo[`${location.latitude},${location.longitude}`]?.display_name || "Fetching location..."}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
            <div className="locations">
                <div className="location-div">
                    Location
                </div>
            </div>
        </div>
    )
}


export default Locations;
