import { useEffect, useState, useMemo, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import './Locations.css';
import {
  getAllWarehouseByUserId,
  getLocationByLatsAndLongs,
} from '../../api/MongoAPIInstance';
import Loader from '../Loader/Loader';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/Reducer';

// MUI Components
import { TextField, Box, IconButton } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

interface Warehouse {
  warehouse_name?: string;
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
  const [uniqueLocations, setUniqueLocations] = useState<Warehouse[]>([]);
  const [map, setMap] = useState<L.Map | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [userMarker, setUserMarker] = useState<L.Marker | null>(null); // State for user marker
  const markerClusterRef = useRef<L.MarkerClusterGroup | null>(null); // Ref for marker cluster group
  const user = useSelector((state: RootState) => state.user.user);

  // Memoize filtered locations for performance improvement
  const filteredLocations = useMemo(
    () =>
      uniqueLocations.filter((location) =>
        location.warehouse_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
      ),
    [uniqueLocations, searchTerm]
  );

  // Fetch warehouses
  const fetchAllWarehouses = async () => {
    try {
      const params = { pageSize: 100, page: 0 };
      const response = await getAllWarehouseByUserId(user.id?.id, params);
      setUniqueLocations(response.data.data);
      setLoader(false);
    } catch (error) {
      console.error('Failed to fetch warehouses:', error);
      setLoader(false);
    }
  };

  // Fetch reverse geolocation data
  const fetchLocationInfo = async (latitude: string, longitude: string) => {
    try {
      const response = await getLocationByLatsAndLongs(latitude, longitude);
      console.log(response)
      if (!response.ok) throw new Error('Failed to fetch location data');
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

  useEffect(() => {
    fetchAllWarehouses();
  }, []);

  useEffect(() => {
    filteredLocations.forEach((location) => {
      fetchLocationInfo(location.latitude, location.longitude);
    });
  }, [filteredLocations]);

  // Initialize the map
  useEffect(() => {
    if (!map && filteredLocations.length > 0) {
      const initialLocation: [number, number] = [
        parseFloat(filteredLocations[0].latitude || '0'),
        parseFloat(filteredLocations[0].longitude || '0'),
      ];

      const mapInstance = L.map('map', {
        center: initialLocation,
        zoom: 3,
        maxZoom: 18,
        minZoom: 3,
        maxBoundsViscosity: 1.0, // Adds resistance near boundaries
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstance);

      // Define the bounds to restrict the map
      const bounds: [[number, number], [number, number]] = [
        [85, -170], // Top-left corner (latitude, longitude)
        [-85, 180], // Bottom-right corner (latitude, longitude)
      ];

      mapInstance.setMaxBounds(bounds); // Restrict the map to these bounds

      // On movement end (dragging or zooming), check if the map is out of bounds
      mapInstance.on('moveend', () => {
        mapInstance.panInsideBounds(bounds, { animate: true }); // Keeps the map inside the bounds
      });

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
  }, [filteredLocations]);

  // Add markers with clustering
  useEffect(() => {
    if (map && filteredLocations.length > 0) {
      // Clear existing markers
      if (markerClusterRef.current) {
        map.removeLayer(markerClusterRef.current);
      }

      const markers = L.markerClusterGroup();
      markerClusterRef.current = markers; // Store marker cluster group in ref

      filteredLocations.forEach((location) => {
        const latitude = parseFloat(location.latitude);
        const longitude = parseFloat(location.longitude);
        const name = location?.warehouse_name || 'Unknown';
        const locationName =
          locationInfo[`${location.latitude},${location.longitude}`]
            ?.display_name || 'Unknown location';

        const marker = L.marker([latitude, longitude])
          .bindPopup(`<b>Warehouse Location</b><br>${name}<br>${locationName}`)
          .on('click', () => {
            navigator.clipboard.writeText(`${latitude}, ${longitude}`).then(
              () => {
                console.log(`Coordinates copied: ${latitude}, ${longitude}`);
              },
              (err) => {
                console.error('Failed to copy coordinates:', err);
              }
            );
          });

        markers.addLayer(marker);
      });

      map.addLayer(markers);
    }
  }, [map, filteredLocations, locationInfo]);

  // Center on user's current location
  const centerOnUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        if (map) {
          // Remove existing user marker if any
          if (userMarker) {
            map.removeLayer(userMarker);
          }
          // Create and add new marker for the user's current location
          const newUserMarker = L.marker([latitude, longitude], {
            icon: L.icon({
              iconUrl: 'https://maps.gstatic.com/tactile/mylocation/mylocation2.png',
              iconSize: [40, 40],
              iconAnchor: [20, 40],
            }),
          }).addTo(map);
          newUserMarker.bindPopup(`<b>Your Current Location</b>`);
          newUserMarker.openPopup();
          setUserMarker(newUserMarker); // Update user marker state
          map.setView([latitude, longitude], 13);
        }
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div className="menu-data">
      {loading ? (
        <Loader />
      ) : (
        <div className="map-container">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            <h1>Locations of warehouses</h1>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <IconButton
                onClick={centerOnUserLocation}
                sx={{
                  color: 'lightseagreen',
                  '&:hover': {
                    color: 'skyblue', // Darker blue on hover
                  },
                }}
              >
                <LocationOnIcon />
              </IconButton>
              <TextField
                label="Search Warehouses"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                sx={{
                  minWidth: '200px',
                }}
              />
            </Box>
          </Box>

          <div className="map" id="map"></div>
        </div>
      )}
    </div>
  );
};

export default Locations;
