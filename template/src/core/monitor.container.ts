import { Container } from 'inversify';
import 'reflect-metadata';
import { Registry } from 'prom-client';

export const monitorContainer = new Container({
    defaultScope: 'Singleton',
    autoBindInjectable: false
});

export const registry = new Registry();

