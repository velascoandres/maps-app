import { useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { useRef, useState, useEffect } from "react";

export type Coords = { lng: number; lat: number; zoom: number };

export type UseMapOut = {
    coords: Coords;
    setRef: (node: HTMLDivElement) => void
};

export type UseMapProps = {
    initialCoords?: Coords;
}


const defaultCoords = { lng: 0, lat: 0, zoom: 0 };

export const useMapBox = (initialCoords: Coords = defaultCoords): UseMapOut => {

    const mapDiv = useRef<HTMLDivElement>();

    const mapRef = useRef<mapboxgl.Map>();

    // Tambien es valido exponer el mapRef
    // al poner null quedara como solo lectura y estara seguro 
    // const mapDiv = useRef<HTMLDivElement>(null);
    const setRef = useCallback(
        (node: HTMLDivElement) => {
            mapDiv.current = node;
        },
        [],
    );

    const [coords, setCoords] = useState<Coords>(initialCoords);

    useEffect(() => {
        const mapboxMap = new mapboxgl.Map({
            container: mapDiv.current as HTMLDivElement,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [
                initialCoords.lng,
                initialCoords.lat,
            ],
            zoom: initialCoords.zoom,
        });
        mapRef.current = mapboxMap;
    }, [initialCoords]);

    // when the map is moving
    useEffect(() => {
        const map = mapRef.current;
        map?.on('move', (event: mapboxgl.MapboxEvent<MouseEvent>) => {
            const zoom = event.target.getZoom();
            const { lat, lng } = event.target.getCenter();
            setCoords({
                lat: +lat.toFixed(4),
                lng: +lng.toFixed(4),
                zoom: +zoom.toFixed(4),
            });
        });
        return () => {
            map?.off('move', () => { });
        }
    }, []);
    return {
        coords,
        setRef,
    }
}