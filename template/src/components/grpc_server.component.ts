import { BaseComponent, component, Logger } from 'nstarter-core';
import { startGrpcServer, stopGrpcServer } from 'nstarter-grpc';
import { config } from '../config';


@component()
export class GrpcServerComponent extends BaseComponent {

    public async init() {
        const { port } = config.components.grpc.server;
        await startGrpcServer(config.components.grpc.server);
        this.setReady(true);
        Logger.info(`Grpc service listening on：${ port }`);
    }

    public async shutdown() {
        await stopGrpcServer();
    }
}
