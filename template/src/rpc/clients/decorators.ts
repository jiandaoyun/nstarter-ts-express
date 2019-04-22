import _ from 'lodash';
import 'reflect-metadata';
import grpc, { Client } from 'grpc';

import { proto } from '../proto';
import {
    UnaryCall,
    ServerStreamingCall
} from '../interfaces';

const CLIENT_META = 'grpc:client';

export function grpcClient<T extends Function>(pkg: string, service?: string) {
    return (constructor: T) => {
        const target = constructor.prototype;
        if (!service) {
            service = _.upperFirst(_.camelCase(_.replace(constructor.name, /client$/i, '')));
        }
        const GrpcClient: typeof Client = _.get(proto, [pkg, service]);
        // TODO replace with config
        const client = new GrpcClient('localhost:9050', grpc.credentials.createInsecure());
        Reflect.defineMetadata(CLIENT_META, { client }, target);
    };
}

export function grpcUnaryCall<T, R>() {
    return (
        target: any,
        key: string,
        descriptor: PropertyDescriptor
    ) => {
        const path = _.upperFirst(_.camelCase(key));
        const run: UnaryCall<T, R> = (conf, callback) => {
            const { client } = Reflect.getMetadata(CLIENT_META, target);
            _.invoke(client, path, conf, callback);
        };
        descriptor.value = run;
    };
}

export function grpcServerStreamingCall<T, R>() {
    return (
        target: any,
        key: string,
        descriptor: PropertyDescriptor
    ) => {
        const path = _.upperFirst(_.camelCase(key));
        const run: ServerStreamingCall<T, R> = (conf, callback) => {
            const { client } = Reflect.getMetadata(CLIENT_META, target);
            return callback(null, _.invoke(client, path, conf));
        };
        descriptor.value = run;
    };
}
