import { Container } from 'inversify';
import 'reflect-metadata';
import getDecorators from 'inversify-inject-decorators';

const container = new Container({
    defaultScope: 'Singleton',
    autoBindInjectable: true
});

const { lazyInject } = getDecorators(container);

export { container, lazyInject };
