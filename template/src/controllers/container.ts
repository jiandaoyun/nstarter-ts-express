import { Container, injectable } from 'inversify';
import 'reflect-metadata';
import getDecorators from 'inversify-inject-decorators';

const container = new Container({
    defaultScope: 'Singleton',
    autoBindInjectable: false
});

const { lazyInject } = getDecorators(container);

export { container, lazyInject };

interface Ctor {
    new(...args: any[]): {}
}

export function provideController<T extends Ctor>() {
    return (constructor: T) => {
        container.bind(constructor).to(injectable()(constructor));
    };
}
