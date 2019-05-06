import grpc from 'grpc';

import { config } from '../../config';

export const server = new grpc.Server();

server.bind(`0.0.0.0:${ config.components.grpc.server.port }`, grpc.ServerCredentials.createInsecure());
