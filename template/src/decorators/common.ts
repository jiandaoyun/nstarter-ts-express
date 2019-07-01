import _ from 'lodash';

/**
 * 设置类属性的 getter 方法
 * @return {(target: any, name: string) => void}
 * @constructor
 */
export function Getter<T = any>() {
    return (target: any, name: string) => {
        Reflect.defineProperty(target, name, {
            enumerable: true,
            get(): T {
                return _.get(this, [`_${ _.snakeCase(name) }`]) as T;
            }
        });
    };
}

/**
 * 设置类属性的 setter 方法
 * @return {(target: any, name: string) => void}
 * @constructor
 */
export function Setter<T = any>() {
    return (target: any, name: string) => {
        Reflect.defineProperty(target, name, {
            configurable: true,
            set(newValue: T) {
                _.set(this, [`_${ _.snakeCase(name) }`], newValue);
            }
        });
    };
}
