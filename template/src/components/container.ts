import _ from 'lodash';
import { Container, injectable } from 'inversify';
import 'reflect-metadata';
import getDecorators from 'inversify-inject-decorators';

const container = new Container({
    defaultScope: 'Singleton',
    autoBindInjectable: false
});

const componentMetaKey = 'ioc:component';

const { lazyInject } = getDecorators(container);

/**
 * 服务定义装饰器
 * @param identifier
 */
export function provideComponent<T extends Constructor>(identifier?: string | symbol) {
    return (constructor: T) => {
        let id = identifier;
        if (!id) {
            id = _.camelCase(constructor.name);
        }
        Reflect.defineMetadata(componentMetaKey, {
            id,
            originName: constructor.name,
        }, constructor);
    };
}

/**
 * 服务对象引用注入装饰器
 * @param identifier
 */
export function injectComponent(identifier?: string | symbol) {
    return function (target: any, key: string) {
        let id = identifier;
        if (!id) {
            id = _.camelCase(key);
        }
        return lazyInject(id)(target, key);
    };
}

/**
 * 服务对象注册工具方法
 * @param target - 被注册服务的构造函数
 */
export function registerComponent(target: Constructor) {
    const identifier = Reflect.getMetadata(componentMetaKey, target);
    container.bind(identifier.id).to(injectable()(target));
}

/**
 * 服务对象实例的获取方法
 * @param target
 */
export function getComponent<T>(target: Constructor<T>): T {
    const identifier = Reflect.getMetadata(componentMetaKey, target);
    return container.get<T>(identifier.id);
}
