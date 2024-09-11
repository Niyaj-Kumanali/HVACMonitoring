import { useEffect, useState } from 'react';
import L from 'leaflet';
import './Locations.css';
import 'leaflet/dist/leaflet.css';
import { getAllWarehouseByUserId } from '../../api/MongoAPIInstance';
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
  const user = useSelector((state: RootState) => state.user.user);

  // Fetch all warehouses
  const fetchAllWarehouses = async () => {
    try {
      const response = await getAllWarehouseByUserId(user.id?.id);

      // Filter for unique locations by comparing latitude and longitude
      const uniqueLocations = response.data.data.reduce(
        (acc: { latitude: string; longitude: string }[], warehouse: Warehouse) => {
          
            acc.push({
              latitude: warehouse.latitude,
              longitude: warehouse.longitude,
            });
          
          return acc;
        },
        []
      );

      setUniqueLocations(uniqueLocations);
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

    uniqueLocations.forEach((location) => {
      fetchLocationInfo(location.latitude, location.longitude);
    });
  }, []);

  // Initialize the map and set markers for warehouse locations
  useEffect(() => {
    if (!map && uniqueLocations.length > 0) {
      const initialLocation: any = [
        parseFloat(uniqueLocations[0].latitude),
        parseFloat(uniqueLocations[0].longitude),
      ];
      const mapInstance = L.map('map', {
        center: initialLocation,
        zoom: 10,
        maxZoom: 18,
        minZoom: 3,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstance);

      const bounds: any = [
        [85, -180],
        [-85, 180]
      ];
      mapInstance.setMaxBounds(bounds);

      // Add click event listener to map
      mapInstance.on('click', (e) => {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        navigator.clipboard.writeText(`${lat}, ${lng}`).then(
          () => {
            console.log(`Coordinates copied: ${lat}, ${lng}`);
          },
          (err) => {
            console.error('Failed to copy coordinates:', err);
          }
        );
      });

      setMap(mapInstance);
    }
  }, [map, uniqueLocations]);

  useEffect(() => {
    if (map && uniqueLocations.length > 0) {
      uniqueLocations.forEach((location) => {
        const latitude = parseFloat(location.latitude);
        const longitude = parseFloat(location.longitude);
        const locationName =
          locationInfo[`${location.latitude},${location.longitude}`]
            ?.display_name || 'Unknown location';

        const marker = L.marker([latitude, longitude])
          .addTo(map)
          .bindPopup(`<b>Warehouse Location</b><br>${locationName}`)
          .openPopup();

        // Add click event listener to marker
        marker.on('click', () => {
          navigator.clipboard.writeText(`${latitude}, ${longitude}`).then(
            () => {
              console.log(`Coordinates copied: ${latitude}, ${longitude}`);
            },
            (err) => {
              console.error('Failed to copy coordinates:', err);
            }
          );
        });
      });
    }
  }, [map, uniqueLocations, locationInfo]);

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
          <div className="map" id="map" style={{ height: '100vh', width: '100%' }}></div>
        </div>
      )}
    </div>
  );
};

export default Locations;
