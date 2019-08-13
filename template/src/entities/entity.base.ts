import * as _ from 'lodash';
import { ajv, IOptionTypes, ISchema, Types } from './entity.ajv';
import { ErrorObject, ValidateFunction } from 'ajv';
import { IEntityConf } from '../types/entities';

interface OptionType {
    [key: string]: any;
}

export enum ProcessMode {
    get,
    set
}

export interface IEntity {
    readonly schema: ISchema;
    readonly validator: ValidateFunction;
    readonly isConfValid: boolean;

    setConfig(options: IEntityConf): void;
    getConfig(): IEntityConf;
}

/**
 * Base class for entity instances.
 *
 * Providing ajv schema validation for entity config.
 *
 * @class BaseEntity
 */
export abstract class BaseEntity<C extends IEntityConf, O extends C = C> implements IEntity {
    protected _options: O = {} as any;
    protected _isConfValid = false;
    protected _errors?: Array<ErrorObject> | null;

    protected abstract _schema: any;
    protected abstract _validate: ValidateFunction;

    /**
     * Get ajv validation schema.
     */
    public get schema(): ISchema {
        return Types.object(this._schema);
    }

    /**
     * Get ajv schema validator for config check.
     */
    public get validator(): ValidateFunction {
        return ajv().compile(this.schema);
    }

    /**
     * Check if the config is valid.
     */
    public get isConfValid(): boolean {
        return this._isConfValid;
    }

    /**
     * Get schema validation errors.
     */
    public get validationErrors(): Array<ErrorObject> | null | undefined {
        return this._errors;
    }

    /**
     * Get enum by value.
     * @param value
     * @param template
     * @private
     */
    protected _getEnum <E>(value: any, template: E) {
        if (_.isNil(value)) {
            return;
        }
        return template[value as keyof E];
    }

    /**
     * Process entity config by schema.
     * @param options
     * @param schema
     * @param mode
     * @private
     */
    protected _processOptionsBySchema(options: OptionType, schema: ISchema, mode: ProcessMode) {
        const result = {};
        let processor = mode === ProcessMode.get ?
            schema._getter : schema._setter;
        if (_.isFunction(processor)) {
            return processor(options);
        }
        _.forEach(schema.properties, (property, key) => {
            let option = _.get(options, key);
            const results: { [key: string]: any } = {};
            switch (property._t) {
                case IOptionTypes.object:
                    // object
                    option = this._processOptionsBySchema(option, property, mode);
                    break;
                case IOptionTypes.array:
                    // array options
                    if (!property.items) {
                        option = [];
                        break;
                    }
                    option = _.map(option, (itemOptions) => {
                        if (!property.items) {
                            return {};
                        }
                        if (property.items._t === IOptionTypes.object) {
                            return this._processOptionsBySchema(itemOptions, property.items, mode);
                        } else {
                            return itemOptions;
                        }
                    });
                    break;
                case IOptionTypes.map:
                    // k-v map
                    _.forEach(option, (itemOptions, name) => {
                        if (!property._obj || _.isNil(itemOptions)) {
                            return;
                        }
                        const result = this._processOptionsBySchema(itemOptions, property._obj, mode);
                        if (name && !_.isNil(result)) {
                            results[name] = result;
                        }
                    });
                    option = results;
                    break;
                default:
                    processor = mode === ProcessMode.get ?
                        property._getter : property._setter;
                    if (processor) {
                        option = processor(option);
                    }
                    break;
            }
            // Skip empty options.
            const isNested = _.isArray(option) || _.isPlainObject(option),
                isMinimize = property._minimize !== false;
            if (_.isNil(option) || (isMinimize && isNested && _.isEmpty(option))) {
                return;
            }
            _.set(result, key, option);
        });
        if (_.isEmpty(result) && schema._minimize !== false) {
            return;
        }
        return result;
    }

    /**
     * Set Config by Schema
     * @param {IEntityConf} options
     * @protected
     */
    protected _setConfig(options: C): void {
        this._options = this._processOptionsBySchema(options, this.schema, ProcessMode.set) as O;
    }


    /**
     * Set entity config.
     * @param options
     */
    public setConfig(options: C) {
        this._isConfValid = this._validate(options) as boolean;
        if (this._isConfValid) {
            this._setConfig(options);
        } else {
            this._errors = this._validate.errors;
        }
    }

    /**
     * Get config by schema.
     * @protected
     */
    protected _getConfig(): C {
        return this._processOptionsBySchema(this._options, this.schema, ProcessMode.get) as C;
    }

    /**
     * Get entity config.
     */
    public getConfig(): C {
        if (this._isConfValid) {
            return this._getConfig();
        } else {
            return {} as any;
        }
    }
}
