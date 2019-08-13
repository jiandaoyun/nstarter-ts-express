import { BaseEntity } from '../entity.base';
import { IBaseConf } from '../../types/config';

export abstract class BaseConfig <C extends IBaseConf, O extends C = C>
    extends BaseEntity<C, O> {

    protected _portOptions = {
        minimum: 1,
        maximum: 65535
    };
}
