import mapboxgl from 'mapbox-gl';
import React, { useContext, useEffect } from 'react'
import { SocketContext } from '../context/SocketContext';
import { MarkerJson, markerToJson } from '../helpers/markerToJson';

import { CustomMarker, MarkerLocation, useMapBox } from '../hooks/useMapBox';


const { REACT_APP_MAPBOX_API_KEY } = process.env;

mapboxgl.accessToken = REACT_APP_MAPBOX_API_KEY as string;


export const MapPage: React.FC = () => {

    const { addMarkers, coords, setRef, newMarker$, markerMove$, updateMarker } = useMapBox();
    const { socket } = useContext(SocketContext);

    // listen existing markers
    useEffect(() => {
        socket.on('list-markers', (markersCollection: Record<string, MarkerJson>) => {
            // add markers
            for (const id in markersCollection) {
                const marker = markersCollection[id];
                console.log(marker);
                addMarkers(marker);
            }
        });
        return () => {
            socket.off('list-markers');
        }
    }, [socket, addMarkers]);


    // new marker
    useEffect(() => {
        newMarker$
            .subscribe(
                (marker: CustomMarker) => {
                    socket.emit('create-marker', { marker: markerToJson(marker) });
                }
            );

        return () => {
            newMarker$.unsubscribe();
        }
    }, [newMarker$, socket]);

    // update marker
    useEffect(() => {
        markerMove$
            .subscribe(
                ({ id, lat, lng }: MarkerLocation) => {
                    socket.emit('update-marker', { marker: { id, lngLat: { lat, lng } } });
                }
            );

        return () => {
            markerMove$.unsubscribe();
        }
    }, [markerMove$, socket]);
    // listen new marker
    useEffect(() => {
        socket.on('new-marker', (marker: MarkerJson) => {
            console.log(marker);
            addMarkers(marker);
        });
        return () => {
            socket.off('new-marker');
        }
    }, [socket, addMarkers]);
    // listen update markers
    useEffect(() => {
        socket.on('update-marker', (marker: MarkerJson) => {
            const { id } = marker;
            const { lat, lng } = marker.lngLat;
            updateMarker({ id: id as string, lat, lng });
        });
        return () => {
            socket.off('new-marker');
        }
    }, [socket, updateMarker]);

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
