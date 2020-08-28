import { ValidateFunction } from 'ajv';
import { BaseConfig } from './base.config';
import { IFormat, Types } from '../entity.ajv';
import { IComponentsConf } from '../../types/config';

let validator: ValidateFunction = () => true;

export class ComponentsConfig extends BaseConfig<IComponentsConf> {
    protected _validate = validator;

    protected _schema = {
        //#module rabbitmq
        rabbitmq: Types.object({
            brokers: Types.array(Types.object({
                host: Types.string({
                    format: IFormat.uri,
                    required: true
                }),
                port: Types.integer({
                    ...this._portOptions,
                    default: 5672,
                    required: true
                })
            }), {
                minItems: 1
            }),
            protocol: Types.string({ required: true }),
            user: Types.string({ required: true }),
            password: Types.string({ required: true }),
            vhost: Types.string({ required: true }),
            params: Types.object({
                heartbeat: Types.integer(),
                frameMax: Types.integer(),
                channelMax: Types.integer(),
                locale: Types.string()
            })
        }),
        //#endmodule rabbitmq
        //#module grpc
        grpc: Types.object({
            server: Types.object({
                port: Types.integer({
                    ...this._portOptions,
                    required: true
                })
            }),
            clients: Types.array(Types.object({
                package: Types.string({ required: true }),
                address: Types.string({ required: true })
            })),
        }),
        //#endmodule grpc
    };
}

validator = new ComponentsConfig().validator;
