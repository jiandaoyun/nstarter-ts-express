import { server } from './server';
import * as Clients from './clients';

import { config } from '../config';

if (config.components.grpc.server.enabled) {
    server.start();
}

export {
    server,
    Clients
};
