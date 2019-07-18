import { ServerWriteableStream, ServerReadableStream } from 'grpc';

export interface UnaryCallback<R> {
    (err: Error | null | undefined, result: R): any;
}

export interface ServerStreamingCallback<R> {
    (err: Error | null | undefined, call: ServerReadableStream<R>): any;
}

/**
 * server unary call handler type
 */
export interface UnaryHandler<T, R> {
    (conf: T, callback?: UnaryCallback<R>): void;
}

/**
 * server server-streaming call handler type
 */
export interface ServerStreamingHandler<T, R> {
    (conf: T, call: ServerWriteableStream<R>): void;
}

/**
 * gRPC handling methods type
 */
export type GrpcHandler<T, R> = UnaryHandler<T, R>
    | ServerStreamingHandler<T, R>;


/**
 * client unary call method type
 */
export interface UnaryCall<T, R> {
    (conf: T, callback: UnaryCallback<R>): void;
}

/**
 * client server-streaming call method type
 */
export interface ServerStreamingCall<T, R> {
    (conf: T, callback: ServerStreamingCallback<R>): void;
}
