import React, { useEffect, useRef, useState } from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 37.7749,
  lng: -122.4194
};

const ProductMap = ({ products }) => {
  const [retailers, setRetailers] = useState([]);
  const [directions, setDirections] = useState(null);
  const mapRef = useRef(null);
  const placesServiceRef = useRef(null);
  const googleMapsApiKey = 'AIzaSyD05vCesru4f8z1oJHMpFra5SGZjt_tGdY';

  // Effect to update retailers when products change
  useEffect(() => {
    if (placesServiceRef.current) {
        console.log(products);
      setRetailers([]); // Clear existing retailers
      setDirections(null); // Clear existing directions
      findRetailers();
    }
  }, [products]); // Dependency on products prop

  const onLoad = (map) => {
    mapRef.current = map;
    placesServiceRef.current = new window.google.maps.places.PlacesService(map);
    findRetailers(); // Initial search
  };

  const findRetailers = () => {
    const uniqueRetailers = new Map();
    
    products.forEach(product => {
      if (product.retailerNames && Array.isArray(product.retailerNames)) {
        product.retailerNames.forEach(retailerName => {
          if (!uniqueRetailers.has(retailerName)) {
            uniqueRetailers.set(retailerName, true);
            searchPlace(retailerName);
          }
        });
      }
    });
  };

  const searchPlace = (retailerName) => {
    const request = {
      query: retailerName,
      fields: ['name', 'geometry'],
      type: ['store']
    };

    placesServiceRef.current.textSearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results[0]) {
        const place = results[0];
        const newRetailer = {
          id: place.place_id,
          name: place.name,
          position: {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          }
        };

        setRetailers(prev => {
          const updatedRetailers = [...prev.filter(r => r.name !== retailerName), newRetailer];
          
          if (mapRef.current && updatedRetailers.length > 0) {
            const bounds = new window.google.maps.LatLngBounds();
            updatedRetailers.forEach(retailer => bounds.extend(retailer.position));
            mapRef.current.fitBounds(bounds);
          }

          if (updatedRetailers.length > 1) {
            calculateRoute(updatedRetailers);
          }

          return updatedRetailers;
        });
      }
    });
  };

  const calculateRoute = (retailerList) => {
    const directionsService = new window.google.maps.DirectionsService();
    
    const waypoints = retailerList.slice(1, -1).map(retailer => ({
      location: retailer.position,
      stopover: true
    }));

    directionsService.route(
      {
        origin: retailerList[0].position,
        destination: retailerList[retailerList.length - 1].position,
        waypoints: waypoints,
        travelMode: window.google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error(`Directions request failed due to ${status}`);
        }
      }
    );
  };

  return (
    <LoadScript
      googleMapsApiKey={googleMapsApiKey}
      libraries={['places']}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onLoad={onLoad}
      >
        {retailers.map(retailer => (
          <Marker
            key={retailer.id}
            position={retailer.position}
            title={retailer.name}
            onClick={() => {
              mapRef.current?.panTo(retailer.position);
            }}
          />
        ))}
        
        {directions && (
          <DirectionsRenderer
            options={{
              directions: directions,
              suppressMarkers: false
            }}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default ProductMap;
