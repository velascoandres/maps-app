import { CustomMarker } from './../hooks/useMapBox';

export type MarkerJson = {
    id?: string;
    lngLat: {
        lat: number;
        lng: number;
    };
}

export const markerToJson = (marker: CustomMarker): MarkerJson => {

    const { lat, lng } = marker.getLngLat();

    return {
        id: marker.id,
        lngLat: {
            lat,
            lng,
        },
    };
}
