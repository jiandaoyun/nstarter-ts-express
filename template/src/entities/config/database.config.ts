import { ValidateFunction } from 'ajv';
import { IFormat, Types } from '../entity.ajv';
import { BaseConfig } from './base.config';
import { IDatabaseConf } from '../../types/config';

let validator: ValidateFunction = () => true;

export class DatabaseConfig extends BaseConfig<IDatabaseConf> {
    protected _validate = validator;

    protected _schema = {
        //#module mongodb
        mongodb: Types.object({
            servers: Types.array(Types.object({
                host: Types.string({
                    format: IFormat.uri,
                    required: true
                }),
                port: Types.integer({
                    ...this._portOptions,
                    default: 27017
                })
            }), {
                minItems: 1,
                required: true
            }),
            replicaSet: Types.string(),
            user: Types.string(),
            password: Types.string(),
            db: Types.string({ required: true }),
            x509: Types.object({
                ca: Types.string(),
                cert: Types.string(),
                key: Types.string()
            }),
            name: Types.string(),
            timeoutMs: Types.integer()
        }),
        //#endmodule mongodb
        //#module redis
        redis: Types.object({
            host: Types.string(),
            port: Types.integer({ ...this._portOptions }),
            name: Types.string({ required: true }),
            password: Types.string(),
            sentinels: Types.array(Types.object({
                host: Types.string({
                    format: IFormat.uri,
                    required: true
                }),
                port: Types.integer({
                    ...this._portOptions,
                    default: 26379,
                    required: true
                }),
            }), {
                minItems: 1
            })
        }),
        //#endmodule redis
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
    };
}

validator = new DatabaseConfig().validator;
