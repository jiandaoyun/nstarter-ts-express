import _ from 'lodash';
import 'reflect-metadata';
import {
    handleUnaryCall,
    handleServerStreamingCall,
    handleCall
} from 'grpc';

import { proto } from '../proto';
import { server } from '../server';
import { GrpcHandler } from '../interfaces';


const METHOD_PREFIX = 'grpc:method:';

/**
 *
 * @param run
 */
function messageHandler<T, R>(run: handleCall<T, R>) {
    return (
        target: any,
        key: string,
        descriptor: PropertyDescriptor
    ) => {
        const name = _.upperFirst(_.camelCase(key));
        Reflect.defineMetadata(`${ METHOD_PREFIX }${ name }`, { name, method: run }, target);
    };
}

/**
 * Class decorator for gRPC services
 * @param pkg - gRPC package of current service
 * @param service - Name of gRPC service defined in proto file
 */
export function grpcService<T extends Function>(pkg: string, service?: string) {
    return (constructor: T) => {
        const target = constructor.prototype;
        const serviceMethods: Record<string, Function> = {};
        _.forEach(Reflect.getMetadataKeys(target), (key) => {
            const { name, method } = Reflect.getMetadata(key, target);
            serviceMethods[name] = method;
        });
        let name = service;
        if (!name) {
            name = _.upperFirst(_.camelCase(_.replace(constructor.name, /service$/i, '')));
        }
        // Register gRPC handlers
        server.addService(_.get(proto, [pkg, name, 'service']), serviceMethods);
    };
}

/**
 * Method decorator for gRPC unary request methods
 */
export function grpcUnaryMethod<T, R>() {
    return (
        target: any,
        key: string,
        descriptor: PropertyDescriptor
    ) => {
        const method: GrpcHandler<T, R> = descriptor.value;
        const run: handleUnaryCall<T, R> = (call, callback) => {
            method.apply(null, [call.request, callback]);
        };
        messageHandler(run)(target, key, descriptor);
    };
}

/**
 * Method decorator for gRPC server-streaming methods
 */
export function grcpServerStreamingMethod<T, R>() {
    return (
        target: any,
        key: string,
        descriptor: PropertyDescriptor
    ) => {
        const method: GrpcHandler<T, R> = descriptor.value;
        const run: handleServerStreamingCall<T, R> = (call) => {
            method.apply(null, [call.request, call]);
        };
        messageHandler(run)(target, key, descriptor);
    };
}
