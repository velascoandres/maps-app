import { Socket, Server } from 'socket.io';
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
            // TODO: list-markers

            // TODO: create-marker

            // TODO: update-marker

        });
    }

}

export {
    Sockets,
};