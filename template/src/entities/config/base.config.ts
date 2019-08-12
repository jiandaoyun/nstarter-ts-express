import { BaseEntity } from '../entity.base';
import { IBaseConfig } from '../../types/config/base.config';

export abstract class BaseConfig <C extends IBaseConfig, O extends C = C>
    extends BaseEntity<C, O> {

    protected _portOptions = {
        minimum: 1,
        maximum: 65535
    };
}
