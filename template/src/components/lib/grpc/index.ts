import { loadProtoPackage } from 'nstarter-grpc';

export const initGrpcProtoPackages = () => {
    loadProtoPackage({
        protoPath: './resources/grpc/worker.proto'
    });
};
