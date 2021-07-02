import mapboxgl from 'mapbox-gl';
import React from 'react'

import { useMapBox } from '../hooks/useMapBox';


const { REACT_APP_MAPBOX_API_KEY } = process.env;

mapboxgl.accessToken = REACT_APP_MAPBOX_API_KEY as string;

export const MapPage: React.FC = () => {

    const { coords, setRef } = useMapBox();

    return (
        <>
            <div className="info">
                Lnn: {coords.lng} | Lat: {coords.lat} | zoom: {coords.zoom}
            </div>

            <div
                ref={setRef}
                className="mapContainer"
            />
        </>
    )
}
