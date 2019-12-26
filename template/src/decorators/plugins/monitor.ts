import _ from 'lodash';
import { monitorContainer, registry } from '../../core/monitor.container';
import { Monitor } from '../../plugins/monitor';
import { injectable } from 'inversify';

/**
 * 监控指标注册方法
 */
export function provideMetric<T extends Constructor>() {
    return (constructor: T) => {
        monitorContainer.bind(constructor).to(injectable()(class extends constructor {
            constructor(...args: any[]) {
                super(...args);
                registry.registerMetric(this.metric);
            }
        }));
    };
}

/**
 * 性能统计
 * @param minTimeMS 触发记录的最短时间
 */
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
