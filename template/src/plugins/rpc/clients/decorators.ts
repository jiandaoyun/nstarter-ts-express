import _ from 'lodash';
import 'reflect-metadata';
import grpc, { Client } from 'grpc';

import { proto } from '../proto';
import {
    UnaryCall,
    ServerStreamingCall
} from '../interfaces';
import { config } from '../../../config';

const CLIENT_META = 'grpc:client';

export function grpcClient<T extends Function>(pkg: string, service?: string) {
    return (constructor: T) => {
        const target = constructor;
        if (!service) {
            service = _.upperFirst(_.camelCase(_.replace(constructor.name, /client$/i, '')));
        }
        const GrpcClient: typeof Client = _.get(proto, [pkg, service]);
        const conf = _.find(config.components.grpc.clients, { package: pkg });
        let meta = {};
        if (conf && conf.address) {
            const client = new GrpcClient(conf.address, grpc.credentials.createInsecure());
            meta = { client };
        }
        Reflect.defineMetadata(CLIENT_META, meta, target);
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
