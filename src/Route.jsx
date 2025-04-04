import { useState, useEffect, useRef } from 'react';

export function Route({ list, zipcode }) {
    const [zip, setAskZip] = useState(false);
    const [url, setUrl] = useState('');
    const baseUrl =`https://www.google.com/maps/dir/${zipcode}`;
    const dir = useRef('');

    useEffect(() => {
        dir.current =''
        const retailers = [...new Set(list.map(product => product.retailer))];
        for (const retailer of retailers) {
            dir.current = dir.current + `/${retailer}`;
        }
        setUrl(`${baseUrl}${dir.current}`);
    }, [list])

    function RoutesLink() {
        return <div><a className="text-2xl" href={url} target="_blank">Find Route</a></div>;
    }

    if (list.length == 0) return <></>;

    if (url) return <RoutesLink />;

}
