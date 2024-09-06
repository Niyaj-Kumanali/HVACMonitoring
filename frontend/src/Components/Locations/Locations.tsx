import { useEffect, useState } from 'react';
import './Locations.css';
import 'leaflet/dist/leaflet.css';

import { getAllWarehouseByUserId } from '../../api/MongoAPIInstance';
import L from 'leaflet';
import Loader from '../Loader/Loader';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/Reducer';

interface Warehouse {
  warehouseName?: string;
  latitude: string;
  longitude: string;
}

interface LocationInfo {
  display_name: string;
}

const Locations = () => {
  const [locationInfo, setLocationInfo] = useState<{
    [key: string]: LocationInfo | null;
  }>({});
  const [loading, setLoader] = useState(true);
  const [uniqueLocations, setUniqueLocations] = useState<
    { latitude: string; longitude: string }[]
  >([]);
  const [map, setMap] = useState<L.Map | null>(null);
  const user = useSelector((state: RootState) => state.user.user)

  // Fetch all warehouses
  const fetchAllWarehouses = async () => {
    try {
      const response = await getAllWarehouseByUserId(user.id?.id || "")

      // Filter for unique locations by comparing latitude and longitude
      const uniqueLocations = response.data.reduce(
        (
          acc: { latitude: string; longitude: string }[],
          warehouse: Warehouse
        ) => {
          const isLocationUnique = !acc.some(
            (location) =>
              location.latitude === warehouse.latitude &&
              location.longitude === warehouse.longitude
          );
          if (isLocationUnique) {
            acc.push({
              latitude: warehouse.latitude,
              longitude: warehouse.longitude,
            });
          }
          return acc;
        },
        []
      );

      setUniqueLocations(uniqueLocations); // Set unique locations

      setLoader(false);
    } catch (error) {
      console.error('Failed to fetch warehouses:', error);
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
          throw new Error('Failed to fetch location data');
        }

        const data: LocationInfo = await response.json();
        setLocationInfo((prevState) => ({
          ...prevState,
          [`${latitude},${longitude}`]: data,
        }));
      } catch (err: any) {
        console.log(
          `Error fetching location for coordinates ${latitude}, ${longitude}:`,
          err.message
        );
      }
    };

    // Iterate over uniqueLocations and fetch location info
    uniqueLocations.forEach((location) => {
      fetchLocationInfo(location.latitude, location.longitude);
    });
  }, [uniqueLocations]);

  // Initialize the map and set markers for warehouse locations
  useEffect(() => {
    if (!map && uniqueLocations.length > 0) {
      // Initialize the map and set it to the first warehouse's location
      const initialLocation: any = [
        parseFloat(uniqueLocations[0].latitude),
        parseFloat(uniqueLocations[0].longitude),
      ];
      const mapInstance = L.map('map').setView(initialLocation, 10);

      // Set up OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstance);

      setMap(mapInstance); // Set the map instance in the state
    }
  }, [map, uniqueLocations]);

  // Add markers to the map when locations are available
  useEffect(() => {
    if (map && uniqueLocations.length > 0) {
      uniqueLocations.forEach((location) => {
        const latitude = parseFloat(location.latitude);
        const longitude = parseFloat(location.longitude);
        const locationName =
          locationInfo[`${location.latitude},${location.longitude}`]
            ?.display_name || 'Unknown location';

        // Add a marker for each location
        L.marker([latitude, longitude])
          .addTo(map)
          .bindPopup(`<b>Warehouse Location</b><br>${locationName}`)
          .openPopup();
      });
    }
  }, [map, uniqueLocations, locationInfo]);

  // Fetch warehouses on component mount
  useEffect(() => {
    fetchAllWarehouses();
  }, []);

  console.log('rendered');

  return (
    <div className="menu-data">
      {loading ? (
        <Loader />
      ) : (
        <div className="map-container">
          <h1>Locations of warehouses</h1>
          <div id="map"></div>
        </div>
      )}
    </div>
  );
};

export default Locations;
