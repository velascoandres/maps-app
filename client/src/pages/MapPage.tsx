import mapboxgl from 'mapbox-gl';
import React, { useEffect } from 'react'

import { CustomMarker, MarkerLocation, useMapBox } from '../hooks/useMapBox';


const { REACT_APP_MAPBOX_API_KEY } = process.env;

mapboxgl.accessToken = REACT_APP_MAPBOX_API_KEY as string;

export const MapPage: React.FC = () => {

    const { coords, setRef, newMarker$, markerMove$ } = useMapBox();

    useEffect(() => {
        newMarker$
            .subscribe(
                (marker: CustomMarker) => {
                    console.log(marker);
                }
            );

        return () => {
            newMarker$.unsubscribe();
        }
    }, [newMarker$]);

    useEffect(() => {
        markerMove$
            .subscribe(
                ({ id, lat, lng }: MarkerLocation) => {
                    console.log('Move ', id);
                }
            );

        return () => {
            markerMove$.unsubscribe();
        }
    }, [markerMove$]);

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
