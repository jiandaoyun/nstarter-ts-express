
declare module 'socket.io-emitter' {
    export interface Emitter {
        to(room: string): Emitter;
        emit(event: string, content: string): Emitter;
    }

    function s (redis, opts?): Emitter;

    export = s;
}
