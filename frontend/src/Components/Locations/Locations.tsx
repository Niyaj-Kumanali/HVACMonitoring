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

import { TextField, IconButton, Tooltip } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import React from 'react';

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
  const [userMarker, setUserMarker] = useState<L.Marker | null>(null);
  const markerClusterRef = useRef<L.MarkerClusterGroup | null>(null);
  const user = useSelector((state: RootState) => state.user.user);
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const filteredLocations = useMemo(
    () =>
      uniqueLocations.filter((location) =>
        location.warehouse_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
      ),
    [uniqueLocations, searchTerm]
  );

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

  const fetchLocationInfo = async (latitude: string, longitude: string) => {
    try {
      const response = await getLocationByLatsAndLongs(latitude, longitude);
      if (!response.ok) throw new Error('Failed to fetch location data');
      const data: LocationInfo = await response.json();
      setLocationInfo((prevState) => ({
        ...prevState,
        [`${latitude},${longitude}`]: data,
      }));
    } catch (err: any) {
      console.error(
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
        maxBoundsViscosity: 1.0,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstance);

      const bounds: [[number, number], [number, number]] = [
        [85, -170],
        [-85, 180],
      ];

      mapInstance.setMaxBounds(bounds);

      mapInstance.on('moveend', () => {
        mapInstance.panInsideBounds(bounds, { animate: true });
      });

      let currentMarker: L.Marker | null = null;

      mapInstance.on('click', async (e) => {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;

        if (currentMarker) {
          mapInstance.removeLayer(currentMarker);
        }

        await fetchLocationInfo(lat.toString(), lng.toString());
        const location =
          locationInfo[`${lat.toString()},${lng.toString()}`]?.display_name ||
          'Unknown location';

        const newMarker = L.marker([lat, lng])
          .bindPopup(
            `<b>New Marker</b><br>${lat.toFixed(6)}, ${lng.toFixed(
              6
            )}<br/>${location}`
          )
          .addTo(mapInstance);

        newMarker.openPopup();

        newMarker.on('popupclose', () => {
          mapInstance.removeLayer(newMarker);
        });

        currentMarker = newMarker;

        navigator.clipboard
          .writeText(`${lat.toFixed(6)}, ${lng.toFixed(6)}`)
          .then(
            () => {
              console.log(
                `Coordinates copied: ${lat.toFixed(6)}, ${lng.toFixed(6)}`
              );
            },
            (err) => {
              console.error('Failed to copy coordinates:', err);
            }
          );
      });

      setMap(mapInstance);
    }
  }, [filteredLocations]);

  useEffect(() => {
    if (map && filteredLocations.length > 0) {
      if (markerClusterRef.current) {
        map.removeLayer(markerClusterRef.current);
      }

      const markers = L.markerClusterGroup();
      markerClusterRef.current = markers;

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

  const centerOnUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        if (map) {
          if (userMarker) {
            map.removeLayer(userMarker);
          }
          const newUserMarker = L.marker([latitude, longitude]).addTo(map);
          newUserMarker.bindPopup(
            `<b>Your Current Location</b><br/>${latitude}, ${longitude}`
          );
          newUserMarker.openPopup();
          setUserMarker(newUserMarker);
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
          <div className="locations">
            <div className="locationsh2">
                <h2>Locations of warehouses</h2>
            </div>
            <div className="locations-searchbar">
                <Tooltip open={open} arrow onClose={handleClose} onOpen={handleOpen} title="Get Current Location">
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
                </Tooltip>

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
            </div>
          </div>
          <div className="map" id="map"></div>
        </div>
      )}
    </div>
  );
};

export default Locations;
