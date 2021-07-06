import { Marker } from "./marker";


type Collection<T> = Record<string, T>;

interface Repository<T> {
    create(entry: T): T;
    update(id: string, entry: T): T;
    delete(id: string): void;
    list(params?: { [k in string]: any }): T[];
}




class MarkerRepository implements Repository<Marker>{

    private readonly _collection: Collection<Marker> = initialCollection;

    MarkerRepository() { }

    create(marker: Marker): Marker {
        this._collection[marker.id] = new Marker(
            marker.id,
            {
                ...marker.lngLat,
            },
        );
        return marker;
    };

    update(id: string, marker: Marker): Marker {
        const entryToUpdate = this._collection[id];
        if (entryToUpdate) {
            this._collection[id].id = id;
            this._collection[id].lngLat = {
                ...marker.lngLat,
            };
            return marker;
        } else {
            throw Error('entry does not exist');
        }
    };

    delete(id: string): void {
        const markerToDelete = this._collection[id];
        if (markerToDelete) {
            delete this._collection[id];
        } else {
            throw Error('marker does not exist');
        }
    };

    list(params?: { [x: string]: any; }): Marker[] {
        return Object.values(this._collection);
    };

    get collection(): Collection<Marker> {
        return this._collection;
    }

}

const initialCollection: Collection<Marker> = {
    '1234512': new Marker('1234512', { lat: 0.12, lng: 0.123 }),
    '123451': new Marker('123451', { lat: 0.0, lng: 0.22 }),
    '1234513': new Marker('1234513', { lat: 0.11, lng: 0.55 }),
    '12345': new Marker('12345', { lat: -0.12, lng: -0.72 }),
}


export {
    MarkerRepository,
}