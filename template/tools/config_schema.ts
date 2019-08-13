import _ from 'lodash';
import fs from 'fs';
import { ConfigEntity } from '../src/entities/config';
import { IOptionTypes, ISchema } from '../src/entities/entity.ajv';

const conf = new ConfigEntity();
const sysAttrs = [
    'env', 'hostname', 'version', 'home_path'
];

const getValidationSchema = (entitySchema: ISchema, level: number = 0) => {
    const schema: Partial<ISchema> = _.omitBy(entitySchema, (v, k) =>
        _.startsWith(k, '_')
    );
    switch (entitySchema._t) {
        case IOptionTypes.object:
            if (level === 0) {
                schema.properties = _.omit(schema.properties, sysAttrs);
                if (schema.required) {
                    schema.required = _.pullAll(schema.required, sysAttrs);
                }
            }
            schema.properties = _.reduce(schema.properties, (res, v, k) => {
                if (v.model) {
                    const Model = v.model;
                    res[k] = getValidationSchema(new Model().schema);
                } else {
                    res[k] = getValidationSchema(v);
                }
                return res;
            }, {} as any);
            break;
        case IOptionTypes.array:
            if (schema.items) {
                schema.items = getValidationSchema(schema.items);
            }
            break;
        default:
            break;
    }
    return schema;
};

fs.writeFileSync('./config.schema.json',
    JSON.stringify(
        getValidationSchema(conf.schema), null, 2
    )
);
