import _ from 'lodash';
import 'reflect-metadata';
import {
    handleUnaryCall,
    handleServerStreamingCall,
    handleCall,
    ServerWriteableStream
} from 'grpc';

import { proto } from './proto';
import { server } from './server';


interface UnaryHandler<T, R> {
    (conf: T, callback?: {
        (err: Error | null | undefined, result: R): any
    }): void
}

interface ServerStreamingHandler<T, R> {
    (conf: T, call: ServerWriteableStream<R>): void
}

/**
 * gRPC handling methods type
 */
type GrpcHandler<T, R> = UnaryHandler<T, R>
    | ServerStreamingHandler<T, R>;

const METHOD_PREFIX = 'grpc:method:';

function MessageHandler<T, R>(run: handleCall<T, R>) {
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
        if (!service) {
            service = _.upperFirst(_.camelCase(_.replace(constructor.name, /service$/i, '')));
        }
        // Register gRPC handlers
        server.addService(_.get(proto, [pkg, service, 'service']), serviceMethods);
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
        MessageHandler(run)(target, key, descriptor);
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
        MessageHandler(run)(target, key, descriptor);
    };
}
