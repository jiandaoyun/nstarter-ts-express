//#module grpc_server
import { server } from './server';
import * as Services from './services';
export {
    server,
    Services,
};
//#endmodule grpc_server

//#module grpc_client
import * as Clients from './clients';
export {
    Clients
};
//#endmodule grpc_client
