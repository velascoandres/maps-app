type LatLng = { lat: number; lng: number; };

class Marker {

    constructor(
        public id: string,
        public latLng: LatLng,
    ) {
    }
    

}

export {
    Marker,
    LatLng,
}