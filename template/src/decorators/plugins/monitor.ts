import _ from 'lodash';
import { Monitor } from '../../plugins/monitor';

export function profiler(minTimeMS = 0) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const method = descriptor.value;
        descriptor.value = async (...args: any[]) => {
            const start = Date.now();
            const result = await method.apply(target, args);
            const time = Date.now() - start;
            if (time > minTimeMS) {
                Monitor.recordFunction({
                    method: propertyKey,
                    class: _.get(target, ['constructor', 'name'], '')
                }, time);
            }
            return result;
        }
    };
}
