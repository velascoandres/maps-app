import * as http from 'http';
import { resolve } from 'path';

import express, { Express } from 'express';
import * as socketio from 'socket.io';
import cors from 'cors';


import { Sockets } from './sockets';
import { MarkerRepository } from './marker.repository';



class Server {

    private app: Express;
    private port: number;
    private server: http.Server;
    private io: socketio.Server;

    constructor(

    ) {
        this.app = express();
        this.port = Number(process.env.PORT);
        // Http server
        this.server = http.createServer(this.app);
        // socket config
        this.io = new socketio.Server(this.server);

    }

    execute(): void {
        // init middlewares
        this.initMiddlewares();
        // handle web sockets
        this.configSockets();
        // init server
        this.server.listen(
            this.port,
            () => {
                console.log('Server is running on port: ', this.port)
            },
        );
    }


    private initMiddlewares(): void {
        this.app.use(cors())
        // serve public directory
        this.app.use('/', express.static(resolve(__dirname + './../../public')))
    }

    private configSockets(): void {
        new Sockets(
            this.io,
            new MarkerRepository(),
        );
    }


}


export {
    Server,
}