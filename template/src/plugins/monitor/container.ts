import { Container } from 'inversify';
import 'reflect-metadata';
import { Registry } from 'prom-client';

export const container = new Container({
    defaultScope: 'Singleton',
    autoBindInjectable: false
});

export const registry = new Registry();

export function provideMetric<T extends Constructor>() {
    return (constructor: T) => {
        container.bind(constructor).to(class extends constructor {
            constructor(...args: any[]) {
                super(...args);
                registry.registerMetric(this.metric);
            }
        });
    };
}
