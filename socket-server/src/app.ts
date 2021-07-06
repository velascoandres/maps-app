import { config } from 'dotenv';

import { Server } from './models/server';

// Read env
config();


const server = new Server();

server.execute();


