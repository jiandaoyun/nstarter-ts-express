import { loadProtoPackage } from 'nstarter-grpc';

export const initGrpcProtoPackages = async () => {
    loadProtoPackage({
        protoPath: './resources/grpc/worker.proto'
    });
};
