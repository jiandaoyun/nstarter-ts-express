import grpc from 'grpc';

export const server = new grpc.Server();
server.bind('0.0.0.0:9050', grpc.ServerCredentials.createInsecure());
