import React, { useEffect, useRef, useState } from 'react'

import mapboxgl from 'mapbox-gl';

const initialPoint = {
    lng: 5,
    lat: 34,
    zoom: 5,
}

const {REACT_APP_MAPBOX_API_KEY} = process.env;

type Coords = { lng: number; lat: number; zoom: number };

export const MapPage: React.FC = () => {

    mapboxgl.accessToken = REACT_APP_MAPBOX_API_KEY as string;

    const mapDiv = useRef<HTMLDivElement>(null);

    const [map, setMap] = useState<mapboxgl.Map | null>(null);
    const [coords, setCoords] = useState<Coords>();


    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapDiv.current as HTMLDivElement,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [
                initialPoint.lng,
                initialPoint.lat,
            ],
            zoom: initialPoint.zoom,
        });
        setMap(map);
    }, [setMap]);

    // when the map is moving
    useEffect(() => {
        map?.on('move', (event: mapboxgl.MapboxEvent<MouseEvent>) => {
            console.log(event);
            const zoom = event.target.getZoom();
            const { lat, lng } = event.target.getCenter();
            setCoords({ lat, lng, zoom });
        });
        return () => {
            map?.off('move', () => { });
        }
    }, [map]);



    return (
        <>
            <div className="info">
                Lnn: {coords?.lng} | Lat: {coords?.lat} | zoom: {coords?.zoom}
            </div>

            <div
                ref={mapDiv}
                className="mapContainer"
            />
        </>
    )
}
