import { useState, useEffect, useRef } from 'react';

export function Route({ list }) {
    const [zip, setAskZip] = useState(false);
    const baseUrl =`https://www.google.com/maps/dir`;
    const dir = useRef('');
    const zipStr = useRef('');
    const [url, setUrl] = useState('');

    useEffect(() => {
        dir.current =''
        const retailers = [...new Set(list.map(product => product.retailer))];
        for (const retailer of retailers) {
            dir.current = dir.current + `/${retailer}`;
        }
    }, [list])

    function buildUrl(position) {
            setUrl(`${baseUrl}/${position}${dir.current}`);
    }

    function getLocation() {
        const location = '';
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
            (position) => {
                location = `${position.coords.latitude},${position.coords.longitude}`;
                buildUrl(location);
            }, 
            (err) => {
                console.log(err);
                setAskZip(true);
            },
            { timeout: 10000, enableHighAccuracy: true, maximumAge: 0 });
        } else {
            setAskZip(true);
        }
    }

    function ZipCode() {
        return (
            <div>
                <input type="text" placeholder="zipcode..?" onChange={(e) => zipStr.current = e.target.value} />
                <button onClick={() => { buildUrl(zipStr.current); }}>Find</button>
            </div>
        );
    }

    function FindLocation() {
        return (
            <div>
                <button onClick={() => getLocation()}>Find a route</button>
            </div>
        );
    }

    function RoutesLink() {
        return <div><a href={url} target="_blank">Find Route</a></div>;
    }

    if (list.length == 0) return <></>;

    if (url) return <RoutesLink />;

    if (zip) return <ZipCode />; else return <FindLocation />;
}
