type LatLng = { lat: number; lng: number; };

class Marker {

    constructor(
        public id: string,
        public lngLat: LatLng,
    ) {
    }
    

}

export {
    Marker,
    LatLng,
}