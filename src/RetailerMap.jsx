import { useEffect, useState } from 'react';
import { APIProvider, Map } from '@vis.gl/react-google-maps';

const API_KEY = "";

function RetailerMap({ list }) {
    const [userLocation, setUserLocation] = useState({ lat: 37.7749, lng: -122.4194 });

    useEffect(() => {
        const getLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const location = {
                            lat: position.coords.latitude,
                            lng: position.coords.longiture
                        };
                        setUserLocation(location)
                    },
                    (err) => {
                        console.error(err);
                    },
                    { timeout: 10000, enableHighAccuracy: true, maximumAge: 0 }
                );
            } else {
                console.log('browser does not support geoposition');
            }
        };

        getLocation();
    }, []);

    return (
        <APIProvider apiKey = { API_KEY }>
            <Map 
                style={{ width: '50vw', height: '50vh' }}
                defaultCenter = {{ lat: userLocation.lat, lng: userLocation.lng}}
                defaultZoom={14}
                gestureHandling={'greedy'}
                disableDefaultUI={true}
            />
        </APIProvider>

    )
}

export default RetailerMap
