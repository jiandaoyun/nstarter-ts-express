import { ValidateFunction } from 'ajv';
import { Types } from '../entity.ajv';
import { BaseConfig } from './base.config';
import { ISystemConf } from '../../types/config';

let validator: ValidateFunction = () => true;

export class SystemConfig extends BaseConfig<ISystemConf> {
    protected _validate = validator;

    private _logSchema = {
        enabled: Types.boolean({ required: true }),
        level: Types.string({ required: true })
    };

    protected _schema = {
        //#module i18n
        locale: Types.string(),
        //#endmodule i18n
        timezone: Types.string(),
        log: Types.object({
            console: Types.object({
                ...this._logSchema,
                colorize: Types.boolean()
            }),
            file: Types.object({
                ...this._logSchema,
                dir: Types.string(),
                zip: Types.boolean(),
                rotate_days: Types.integer()
            }),
            //#module graylog
            graylog: Types.object({
                ...this._logSchema,
                servers: Types.array(Types.object({
                    host: Types.string({ required: true }),
                    port: Types.integer({ required: true })
                }), { required: true })
            }),
            //#endmodule graylog
            //#module sentry
            sentry: Types.object({
                dsn: Types.string({ required: true })
            })
            //#endmodule sentry
        }),
        req_log: Types.object({
            enabled: Types.boolean()
        }),
        //#module monitor
        monitor: Types.object({
            metric_path: Types.string(),
            //#module cron
            gateway: Types.string()
            //#endmodule cron
        })
        //#endmodule monitor
    };
}

validator = new SystemConfig().validator;
