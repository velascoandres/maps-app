import React, { useCallback, useRef, useState, useEffect } from 'react';

import mapboxgl from 'mapbox-gl';
import { v4 as uuidv4 } from 'uuid';
import { Subject } from 'rxjs';


export type Coords = { lng: number; lat: number; zoom: number };
export type MarkerLocation = { lng: number; lat: number; id?: string };

export type UseMapOut = {
    coords: Coords;
    markersRef: React.MutableRefObject<MetaMarker>,
    newMarker$: Subject<CustomMarker>,
    markerMove$: Subject<MarkerLocation>,
    setRef: (node: HTMLDivElement) => void,
    addMarkers: (event: { id?: string; lngLat: { lat: number, lng: number } }) => void,
};

export type UseMapProps = {
    initialCoords?: Coords;
}

export type CustomMarker = mapboxgl.Marker & { id?: string };



export type MetaMarker = Record<string, CustomMarker>;




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

    // Reference to markers
    const markersRef = useRef<MetaMarker>({});

    // Observables Rxjs
    const markerMove = useRef(new Subject<MarkerLocation>());
    const newMarker = useRef(new Subject<CustomMarker>());


    // function to add markers
    const addMarkers = useCallback(
        (event: { id?: string; lngLat: { lat: number, lng: number } }) => {

            const { lat, lng } = event.lngLat;
            const marker: CustomMarker = new mapboxgl.Marker();
            marker
                .setLngLat([lng, lat])
                .addTo(mapRef.current as mapboxgl.Map)
                .setDraggable(true);

            // si el marcador ya tiene ID
            const markerId = event.id ? event.id : uuidv4();
            console.log(markerId);
            marker.id = markerId;
            markersRef.current[markerId] = marker;

            // si el marcador tiene ID no emitir
            if (!event.id) {
                newMarker.current.next(marker);
            }

            // listen marker drags event
            marker.on('drag', (event: any) => {
                const currentMarker = event.target as CustomMarker;
                const { lng, lat } = currentMarker.getLngLat();
                const { id } = currentMarker;
                // TODO: emitir los cambios del marcador
                markerMove.current.next({ id, lat, lng });
            });

        },
        [],
    )
    // init map
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

    // add markers when make a click
    useEffect(() => {
        mapRef.current?.on('click', addMarkers);
    }, [addMarkers]);

    return {
        coords,
        markersRef,
        setRef,
        addMarkers,
        newMarker$: newMarker.current,
        markerMove$: markerMove.current,
    }
}
