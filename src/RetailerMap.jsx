import React, { useEffect, useState, useRef } from 'react';
import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectionsRenderer,
  InfoWindow,
} from '@react-google-maps/api';

// Define libraries outside the component
const LIBRARIES = ['places'];

const containerStyle = {
  width: '70%',
  height: '500px',
  float: 'left',
};

const panelStyle = {
  width: '30%',
  float: 'left',
  padding: '10px',
};

const RetailerMap = ({ krogerInfo = {}, walmartInfo = {} }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [stores, setStores] = useState([]);
  const [directions, setDirections] = useState(null);
  const [error, setError] = useState(null);
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');
  const [activeMarker, setActiveMarker] = useState(null);
  const mapRef = useRef(null);

  // Replace with your actual Google Maps API key
  const googleMapsApiKey = 'YOUR_API_KEY';

  // Get user location
  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            console.log('User location:', location);
            setUserLocation(location);
            setError(null);
          },
          (err) => {
            console.error('Geolocation error:', err);
            let errorMessage = 'Failed to get location. Using default: San Francisco.';
            if (err.code === 1) errorMessage = 'Location permission denied.';
            if (err.code === 2) errorMessage = 'Position unavailable. Try manual input.';
            if (err.code === 3) errorMessage = 'Location request timed out.';
            setError(errorMessage);
            setUserLocation({ lat: 37.7749, lng: -122.4194 });
          },
          { timeout: 10000, enableHighAccuracy: true, maximumAge: 0 }
        );
      } else {
        setError('Geolocation not supported by your browser.');
        setUserLocation({ lat: 37.7749, lng: -122.4194 });
      }
    };

    getLocation();
  }, []);

  // Trigger store search when userLocation changes
  useEffect(() => {
    if (userLocation && mapRef.current) {
      console.log('Finding stores for location:', userLocation);
      findClosestStores(userLocation, mapRef.current);
    }
  }, [userLocation]);

  const onMapLoad = (map) => {
    mapRef.current = map;
    console.log('Map loaded');
  };

  // Find the closest Kroger and Walmart
  const findClosestStores = (location, map) => {
    const service = new google.maps.places.PlacesService(map);
    const storeTypes = [
      { name: 'Kroger', key: 'kroger' },
      { name: 'Walmart', key: 'walmart' },
    ];
    const results = {};

    storeTypes.forEach(({ name, key }) => {
      const request = {
        location: new google.maps.LatLng(location.lat, location.lng),
        rankBy: google.maps.places.RankBy.DISTANCE,
        name,
      };

      service.nearbySearch(request, (places, status) => {
        console.log(`Places API response for ${name}:`, { status, places });
        if (status === google.maps.places.PlacesServiceStatus.OK && places.length > 0) {
          const filteredPlace = places.find((place) =>
            place.name.toLowerCase().includes(name.toLowerCase())
          );
          if (filteredPlace) {
            results[key] = filteredPlace;
          } else {
            console.warn(`No exact match for ${name} found in results`);
          }
        } else {
          console.warn(`No results or error for ${name}: ${status}`);
        }

        if (Object.keys(results).length === storeTypes.length) {
          const closestStores = deduplicateStores([results.kroger, results.walmart].filter(Boolean));
          if (closestStores.length > 0) {
            calculateDistances(location, closestStores);
          } else {
            setError('No Kroger or Walmart found nearby.');
          }
        }
      });
    });
  };

  // Deduplicate stores by coordinates
  const deduplicateStores = (stores) => {
    const uniqueStores = [];
    const seenCoords = new Set();

    stores.forEach((store) => {
      const coords = `${store.geometry.location.lat()}-${store.geometry.location.lng()}`;
      if (!seenCoords.has(coords)) {
        seenCoords.add(coords);
        uniqueStores.push({
          ...store,
          address: store.vicinity || 'Address not available', // Use actual address from Places API
        });
      } else {
        console.log(`Duplicate coordinates found for ${store.name}, skipping:`, store);
      }
    });

    return uniqueStores;
  };

  // Calculate distances
  const calculateDistances = (origin, stores) => {
    const distanceService = new google.maps.DistanceMatrixService();
    const destinations = stores.map((store) => store.geometry.location);

    distanceService.getDistanceMatrix(
      {
        origins: [new google.maps.LatLng(origin.lat, origin.lng)],
        destinations,
        travelMode: 'DRIVING',
      },
      (response, status) => {
        console.log('Distance Matrix response:', { status, response });
        if (status === 'OK') {
          const distances = response.rows[0].elements;
          const updatedStores = stores.map((store, index) => ({
            ...store,
            distance: distances[index].distance.value,
            distanceText: distances[index].distance.text,
            info: store.name.toLowerCase().includes('kroger') ? krogerInfo : walmartInfo,
          }));

          updatedStores.sort((a, b) => a.distance - b.distance);
          console.log('Closest stores with distances:', updatedStores);
          setStores(updatedStores);
          plotRoute(origin, updatedStores);
        } else {
          setError(`Distance calculation failed: ${status}`);
          const updatedStores = stores.map((store) => ({
            ...store,
            info: store.name.toLowerCase().includes('kroger') ? krogerInfo : walmartInfo,
          }));
          setStores(updatedStores);
          plotRoute(origin, updatedStores);
        }
      }
    );
  };

  // Plot route: User Location -> Kroger -> Walmart
  const plotRoute = (origin, stores) => {
    if (stores.length < 1) {
      console.log('Not enough stores for a route:', stores.length);
      return;
    }

    const directionsService = new google.maps.DirectionsService();
    const waypoints = stores.slice(0, 1).map((store) => ({
      location: store.geometry.location,
      stopover: true,
    }));

    directionsService.route(
      {
        origin: new google.maps.LatLng(origin.lat, origin.lng),
        destination: stores.length === 2 ? stores[1].geometry.location : stores[0].geometry.location,
        waypoints,
        travelMode: 'DRIVING',
      },
      (result, status) => {
        console.log('Directions response:', { status, result });
        if (status === 'OK') {
          setDirections(result);
        } else {
          setError('Failed to plot route: ' + status);
        }
      }
    );
  };

  // Handle manual location input
  const handleManualLocation = (e) => {
    e.preventDefault();
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setError('Invalid latitude or longitude.');
    } else {
      const newLocation = { lat, lng };
      console.log('Manual location set:', newLocation);
      setUserLocation(newLocation);
      setError(null);
    }
  };

  // Handle marker click
  const handleMarkerClick = (storeId) => {
    setActiveMarker(storeId);
  };

  const handleInfoWindowClose = () => {
    setActiveMarker(null);
  };

  return (
    <div>
      <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={LIBRARIES}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={userLocation || { lat: 37.7749, lng: -122.4194 }}
          zoom={10}
          onLoad={onMapLoad}
        >
          {stores.map((store, index) => (
            <Marker
              key={index}
              position={store.geometry.location}
              title={store.name}
              onClick={() => handleMarkerClick(index)}
            >
              {activeMarker === index && (
                <InfoWindow onCloseClick={handleInfoWindowClose}>
                  <div>
                    <h4>{store.name}</h4>
                    <p>Distance: {store.distanceText || 'Unavailable'}</p>
                    <p>Address: {store.address}</p>
                    {store.info.phone && <p>Phone: {store.info.phone}</p>}
                    {store.info.hours && <p>Hours: {store.info.hours}</p>}
                  </div>
                </InfoWindow>
              )}
            </Marker>
          ))}
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </LoadScript>
      <div style={panelStyle}>
        <h3>Nearest Retailers</h3>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {stores.length > 0 ? (
          stores.map((store, index) => (
            <div key={index}>
              {index + 1}. {store.name} - {store.distanceText || 'Distance unavailable'}
            </div>
          ))
        ) : (
          <p>No stores found yet.</p>
        )}
        <form onSubmit={handleManualLocation} style={{ marginTop: '10px' }}>
          <p>Enter location manually:</p>
          <input
            type="text"
            placeholder="Latitude (e.g., 37.7749)"
            value={manualLat}
            onChange={(e) => setManualLat(e.target.value)}
            style={{ marginRight: '5px' }}
          />
          <input
            type="text"
            placeholder="Longitude (e.g., -122.4194)"
            value={manualLng}
            onChange={(e) => setManualLng(e.target.value)}
            style={{ marginRight: '5px' }}
          />
          <button type="submit">Set Location</button>
        </form>
      </div>
    </div>
  );
};

export default RetailerMap;
