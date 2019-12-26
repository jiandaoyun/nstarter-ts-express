import {
    ConfirmChannel,
    ConsumeMessage,
    GetMessage,
    MessageProperties,
    MessagePropertyHeaders,
    Options
} from 'amqplib';
import { DelayLevel, ExchangeType, Priority } from './constants';

type Extend<Source, Target> = Omit<Source, keyof Target> & Target;

/**
 * 队列链接启动方法
 */
export interface ISetupFunc<T = any> {
    (channel: ConfirmChannel): Promise<T>;
}

/**
 * 队列接口
 */
export interface IAbstractQueue {
    serializePayload<T>(content: T): Promise<Buffer>;
    deserializePayload<T>(content: Buffer): Promise<T | IEmptyMessage>;
    close(): Promise<void>;
}

/**
 * RabbitMQ Exchange 声明参数
 */
export interface IExchangeOptions extends Options.AssertExchange {
    durable: boolean;
    internal: boolean;
    autoDelete: boolean;
    alternateExchange: string;
    arguments?: any;
}

/**
 * RabbitMQ Queue 声明参数
 */
export interface IQueueOptions extends Options.AssertQueue {
    exclusive: boolean;
    durable: boolean;
    autoDelete: boolean;
    deadLetterExchange?: string;
    deadLetterRoutingKey?: string;
    maxLength?: number;
    maxPriority?: number;
    arguments?: any;
    messageTtl?: number;
    expires?: number;
}

export interface IExchangeConfig {
    name: string;
    type: ExchangeType;
    options: IExchangeOptions;
}

export interface IQueueConfig {
    name: string;
    exchange: IExchangeConfig;
    routingKey: string;
    options: IQueueOptions;
}

export interface IEmptyMessage {
}

/**
 * 消息体
 */
export interface IQueueMessage extends IEmptyMessage {
    mqId?: string;
    seqNo?: number;
}

export type IQueuePayload<T = IQueueMessage> = T extends IQueueMessage ? T : number | string;

export interface IProduceHeaders extends MessagePropertyHeaders {
    'x-retry-times'?: number;
    'x-retry-delay'?: DelayLevel;
    'x-p-timestamp'?: number;
}

/**
 * 生产消息配置
 */
export interface IProduceOptions extends Options.Publish {
    /**
     * 生产者配置
     */
    mandatory: boolean;
    persistent: boolean;
    deliveryMode: boolean;
    headers: IProduceHeaders;
    priority?: Priority;
    expiration?: string | number;
    pushRetryTimes?: number;
    pushDelay?: DelayLevel; // 延时添加到队列
    /**
     * 消费者配置
     */
    retryTimes?: number;
    retryDelay?: DelayLevel;
}

/**
 * consumer
 */

export type IMessageProperties = Extend<MessageProperties, {
    headers: IProduceHeaders
}>;

export type IFetchMessage<T> = Extend<GetMessage, {
    content: IQueuePayload<T>,
    properties: IMessageProperties
}>;

export type ISubscribeMessage<T> = Extend<ConsumeMessage, {
    content: IQueuePayload<T>,
    properties: IMessageProperties
}>;

// 接收消息参数配置
export interface IConsumeOptions extends Options.Consume {
}

export interface IMessageHandler<T> {
    (payload: IFetchMessage<T> | ISubscribeMessage<T>): void;
}
