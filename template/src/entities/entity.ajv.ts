import _ from 'lodash';
import fs from 'fs';
import Ajv from 'ajv';
import AjvKeywords from 'ajv-keywords';
import mongoose from 'mongoose';
import { IEntity } from './entity.base';
import { IEntityConf } from '../types/entities';

const ObjectId = mongoose.Types.ObjectId;

interface IProperty {
    [key: string]: ISchema;
}

export interface ITypeSchema {
    type: string[];
    properties?: IProperty;
    patternProperties?: IProperty;
    items?: ISchema;
    required?: string[];
    format?: string;
    model?: any;
    _t: IOptionTypes;
    _obj?: ISchema;
    _required?: boolean;
    _getter?: Function;
    _setter?: Function;
    _minimize?: boolean;
}

export interface ISchema extends Partial<ITypeSchema> {
    oneOf?: ISchema[];
    anyOf?: ISchema[];
    instanceof?: string;
}

export enum IFormat {
    // Pre-defined formats.
    uri = 'uri-reference',
    datetime = 'date-time',
    // Extended formats.
    oid = 'oid'
}

export enum IOptionTypes {
    string = 'string',
    number = 'number',
    integer = 'integer',
    boolean = 'boolean',
    date_time = 'date_time',
    array = 'array',
    object = 'object',
    oid = 'oid',
    map = 'map',
    oneOf = 'oneOf',
    anyOf = 'anyOf',
    patternProperty = 'patternProperty'
}

/**
 * Ajv schema config options.
 */
interface ITypeOption<V, E> {
    // ajv options
    const?: V;
    // extend options
    required?: boolean;
    enum?: E;
    default?: V;
    model?: new () => IEntity;
    getter?: Function;
    setter?: Function;
    _minimize?: boolean;
}

/**
 * Ajv keywords options
 * @see https://github.com/epoberezkin/ajv/blob/master/KEYWORDS.md#type
 */

interface StringOption<E> extends ITypeOption<string, E> {
    maxLength?: number;
    minLength?: number;
    pattern?: string;
    format?: string;
}

interface NumberOption<E> extends ITypeOption<number, E> {
    maximum?: number;
    minimum?: number;
    multipleOf?: number;
}

interface ArrayOption<V, E> extends ITypeOption<V[], E> {
    maxItems?: number;
    minItems?: number;
    uniqueItems?: boolean;
    items?: ISchema[];
    additionalItems?: boolean | ISchema;
    contains?: ISchema;
}

/**
 *
 */
export function ajv() {
    const ajv = new Ajv({
        useDefaults: true,
        $data: true
    });
    ajv.addMetaSchema(JSON.parse(
        fs.readFileSync('./node_modules/ajv/lib/refs/json-schema-draft-06.json', 'utf8')
    ));

    // Add custom format.
    ajv.addFormat(IFormat.oid, /^[0-9a-f]{24}$/);

    // Add extra ajv keywords.
    AjvKeywords(ajv, ['typeof', 'instanceof', 'select']);

    // Add custom instance constructors.
    const instanceofDefinition = AjvKeywords.get('instanceof').definition;
    instanceofDefinition.CONSTRUCTORS.ObjectId = ObjectId;

    return ajv;
}

/**
 * Tools methods for creating ajv schema types.
 */
export class Types {
    /**
     * Pre-config schema type options.
     * @param type
     * @param options
     * @private
     *
     * @see https://github.com/epoberezkin/ajv/blob/master/KEYWORDS.md#type
     * @see https://github.com/epoberezkin/ajv
     */
    protected static _getTypeOptions<V, E>(type: IOptionTypes, options: ITypeOption<V, E>) {
        let enums,
            _required;
        let _getter = options.getter,   // attributes -> config
            _setter = options.setter;   // config -> attributes
        // Auto transform string to predefined enums.
        if (type === IOptionTypes.string && options.enum) {
            enums = _.values(options.enum);
            _getter = (value: string) => value;
            _setter = (value: string) => {
                if (_.isArray(options.enum)) {
                    return _.find<string>(options.enum, (v: string) => v === value);
                }
                return options.enum && options.enum[value as keyof E];
            };
        }
        // Generate nested object instance.
        if (type === IOptionTypes.object && options.model) {
            _getter = (value?: IEntity): IEntityConf | undefined => {
                if (value) {
                    return value.getConfig();
                }
                return undefined;
            };
            _setter = (value: object): IEntity | undefined => {
                if (!options.model) {
                    return;
                }
                const Model = options.model;
                const entity = new Model();
                entity.setConfig(value);
                return entity;
            };
        }
        // Set if the attribute is required.
        if (options.default) {
            options.required = false;
        }
        if (options.required) {
            _required = options.required;
        }
        return {
            ..._.omit(options, ['enum', 'required']),
            enum: enums,
            // Private schema options, use prefix "_" to distinguish with ajv schema options.
            _required,
            _getter,
            _setter,
            _t: type,
            // Drop nested empty objects by default.
            _minimize: _.get(options, '_minimize', true)
        };
    }

    /**
     * Methods for creating schema type definitions.
     */
    /**
     * String
     * @param options
     */
    public static string<E>(options: StringOption<E> = {}): ISchema {
        return {
            ...Types._getTypeOptions(IOptionTypes.string, options),
            type: ['string']
        };
    }

    /**
     * Number
     * @param options
     */
    public static number<E>(options: NumberOption<E> = {}): ISchema {
        return {
            ...Types._getTypeOptions(IOptionTypes.number, options),
            type: ['number']
        };
    }

    /**
     * Integer
     * @param options
     */
    public static integer<E>(options: NumberOption<E> = {}): ISchema {
        return {
            ...Types._getTypeOptions(IOptionTypes.integer, options),
            type: ['integer']
        };
    }

    /**
     * Datetime
     * @param options
     */
    public static dateTime<E>(options: ITypeOption<Date, E> = {}): ISchema {
        return {
            anyOf: [
                {
                    ...Types._getTypeOptions(IOptionTypes.date_time, options),
                    type: ['string'],
                    format: IFormat.datetime
                },
                { instanceof: 'Date' }
            ],
            _t: IOptionTypes.anyOf
        };
    }

    /**
     * Boolean
     * @param options
     */
    public static boolean<E>(options: ITypeOption<boolean, E> = {}): ISchema {
        return {
            ...Types._getTypeOptions(IOptionTypes.boolean, options),
            type: ['boolean']
        };
    }

    /**
     * Array
     * @param items
     * @param options
     */
    public static array<V, E>(items?: ISchema, options: ArrayOption<V, E> = {}): ISchema {
        return {
            ...Types._getTypeOptions(IOptionTypes.array, options),
            type: ['array'],
            items
        };
    }

    /**
     * Nested object
     * @param properties
     * @param options
     */
    public static object<E>(properties?: IProperty, options: ITypeOption<object, E> = {}): ISchema {
        // Generate required attributes check.
        const required: string[] = [];
        _.forEach(properties, (property, key) => {
            if (property._required || !_.isEmpty(property.required)) {
                required.push(key);
            }
        });
        options.required = options.required || !_.isEmpty(required);
        return {
            ...Types._getTypeOptions(IOptionTypes.object, options),
            type: ['object'],
            properties,
            required
        };
    }

    /**
     * Extended Types
     */
    /**
     * Mongodb ObjectId
     */
    public static oid() {
        return {
            anyOf: [
                Types.string({ format: IFormat.oid }),
                { instanceof: 'ObjectId' }
            ],
            _t: IOptionTypes.oid
        };
    }

    /**
     * Mapping table
     * @param obj
     * @param options
     */
    public static map<E>(obj?: ISchema, options: ITypeOption<object, E> = {}) {
        return {
            ...Types._getTypeOptions(IOptionTypes.object, options),
            type: ['object'],
            _obj: obj,
            _t: IOptionTypes.map
        };
    }

    public static patternProperty<E>(properties?: IProperty, options: ITypeOption<object, E> = {}) {
        return {
            ...Types._getTypeOptions(IOptionTypes.object, options),
            type: ['object'],
            patternProperties: properties,
            _t: IOptionTypes.patternProperty
        };
    }

    /**
     * OneOf schemas
     * @param items
     */
    public static oneOf(items: ISchema[]): ISchema {
        return {
            oneOf: items,
            _t: IOptionTypes.oneOf
        };
    }

    /**
     * AnyOf schemas
     * @param items
     */
    public static anyOf(items: ISchema[]): ISchema {
        return {
            anyOf: items,
            _t: IOptionTypes.anyOf
        };
    }
}
