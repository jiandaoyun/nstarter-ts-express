import { ValidateFunction } from 'ajv';
import { Types } from '../entity.ajv';
import { BaseConfig } from './base.config';
import { IServerConf } from '../../types/config';

let validator: ValidateFunction = () => true;

export class ServerConfig extends BaseConfig<IServerConf> {
    protected _validate = validator;

    protected _schema = {
        http: Types.object({
            port: Types.integer({
                ...this._portOptions,
                required: true
            })
        }),
        //#module web
        static: Types.object({
            views: Types.string({ required: true }),
            public: Types.string({ required: true })
        }),
        session: Types.object({
            secret: Types.string({ required: true }),
            name: Types.string({ required: true })
        }),
        //#endmodule web
        cookie: Types.object({
            secret: Types.string({ required: true }),
            policy: Types.object({
                httpOnly: Types.boolean({ required: true }),
                maxAge: Types.integer(),
                signed: Types.boolean({ required: true }),
                secure: Types.boolean({ required: true }),
                domain: Types.string()
            })
        })
    };
}

validator = new ServerConfig().validator;
