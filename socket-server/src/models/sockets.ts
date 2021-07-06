import { Socket, Server } from 'socket.io';
import { Marker } from './marker';
import { MarkerRepository } from './marker.repository';

class Sockets {

    constructor(
        private readonly io: Server,
        private readonly markerRepository: MarkerRepository,
    ) {
        this.handleSocketEvents();
    }

    handleSocketEvents(): void {
        // On connection
        this.io.on('connection', (socket: Socket) => {
            console.log('client connected');
            // List markers
            socket.emit('list-markers', this.markerRepository.collection);
            // create-markers
            socket.on(
                'create-marker', ({ marker }: { marker: Marker }) => {
                    const newMarker = this.markerRepository.create(marker);
                    socket.broadcast.emit('new-marker', newMarker);
                }
            );
            // update-marker
            socket.on(
                'update-marker', ({ marker }: { marker: Marker }) => {
                    const updatedMarker = this.markerRepository.update(marker.id, marker);
                    socket.broadcast.emit('update-marker', updatedMarker);
                }
            );
        });
    }

}

export {
    Sockets,
};