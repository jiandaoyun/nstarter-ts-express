import { ValidateFunction } from 'ajv';
import { BaseConfig } from './base.config';
import { Types } from '../entity.ajv';
import { IComponentsConf } from '../../types/config';

let validator: ValidateFunction = () => true;

export class ComponentsConfig extends BaseConfig<IComponentsConf> {
    protected _validate = validator;

    protected _schema = {
        grpc: Types.object({
            //#module grpc_server
            server: Types.object({
                port: Types.integer({
                    ...this._portOptions,
                    required: true
                })
            }),
            //#endmodule grpc_server
            //#module grpc_client
            clients: Types.array(Types.object({
                package: Types.string({ required: true }),
                address: Types.string({ required: true })
            })),
            //#endmodule grpc_client
        })
    };
}

validator = new ComponentsConfig().validator;
