import _ from 'lodash';
import grpc, { GrpcObject } from 'grpc';
import * as protoLoader from '@grpc/proto-loader';

export const proto: Record<string, GrpcObject> = {};

interface LoadPackageOptions {
    protoPath: string;
    package: string;
    loader?: protoLoader.Options;
}

export function loadProtoPackage(options: LoadPackageOptions) {
    const o = _.defaultsDeep(options, {
        protoPath: '',
        package: '',
        loader: {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true
        }
    });
    const pack = protoLoader.loadSync(o.protoPath, o.loader);
    proto[o.package] = grpc.loadPackageDefinition(pack)[o.package] as GrpcObject;
}

loadProtoPackage({
    protoPath: './resources/grpc/worker.proto',
    package: 'worker'
});
