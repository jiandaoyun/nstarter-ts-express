import {
    Channel,
    ConfirmChannel,
    ConsumeMessage, ConsumeMessageFields, GetMessage,
    GetMessageFields,
    MessageProperties,
    Options
} from 'amqplib/callback_api';

export type RabbitMQMessage = GetMessage | ConsumeMessage;
export type RabbitMQChannel = Channel | ConfirmChannel;

export enum ChannelMode {
    normal = 'normal',
    confirm = 'confirm'
}
export enum ExchangeType {
    topic = 'topic',
    headers = 'headers',
    fanout = 'fanout',
    direct = 'direct'
}

export interface ExchangeOptions extends Options.AssertExchange {
    durable: boolean;
    internal: boolean;
    autoDelete: boolean;
    alternateExchange: string;
    arguments?: any;
}

export interface Exchange {
    name: string;
    type: ExchangeType;
    options: ExchangeOptions;
}

export interface QueueOptions extends Options.AssertQueue {
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

export interface Queue {
    name: string,
    exchange: Exchange;
    routingKey: string;
    options: QueueOptions;
}


export interface BaseMessage {
    content?: any;
    meta?: any
}

export interface BaseProduceOptions {
}

export interface BaseConsumeOptions {
}

/**
 * PULL 接收消息内容
 */
export interface FetchMessage extends BaseMessage {
    content: any;
    fields?: GetMessageFields;
    properties?: MessageProperties;
}

/**
 * PUSH 接收消息内容
 */
export interface SubscribeMessage extends BaseMessage {
    content: any;
    fields?: ConsumeMessageFields;
    properties?: MessageProperties;
}

// 接收消息
export type Message = FetchMessage | SubscribeMessage | false | null;

// 发送消息参数配置
export interface ProduceOptions extends Options.Publish, BaseProduceOptions {
    mandatory: boolean;
    persistent: boolean;
    deliveryMode: boolean | number;
    priority?: number;
    replyTo?: string;
}

// 接收消息参数配置
export interface ConsumeOptions extends Options.Consume, BaseConsumeOptions {
}

// 消息处理函数
export interface MessageHandler<M = Message> {
    (message: M, callback: Callback<Message>): void;
}

// 消费者初始化参数配置
export interface ConsumeConfig {
    queue: Queue;
    megHandler?: MessageHandler;
}

export interface QueueBase {
    /**
     * 初始化信息
     */
    init(callback: Callback): void;
}

export interface ProduceImpl<Q extends Queue, O extends BaseProduceOptions> {
    /**
     * 消息发送
     * @param queue - 队列配置
     * @param payload - 消息内容
     * @param options - 选项配置
     * @param callback - 回调函数
     */
    publish(queue: Q, payload: any, options: O, callback: Callback): void;
}

export interface ConsumeImpl<Q extends Queue, O extends BaseConsumeOptions, M extends BaseMessage | null | false> {
    /**
     * 主动拉取消息
     * @param options - 选项配置
     * @param callback - 回调函数
     */
    fetch(options: O, callback: Callback<M>): void;

    /**
     * 消息订阅
     * @param options - 选项配置
     * @param callback - 回调函数
     */
    subscribe(options: O, callback: Callback<M>): void;
}

/**
 * 消费者
 */
export interface ConsumerImpl {
    name: string;
    init(callback: Callback): void;

    consume(): void;

    close(callback: Callback): void;
}

export interface TaskPayload {
}
export interface TaskOptions {
}

export interface ProducerImpl<P extends TaskPayload, O extends TaskOptions> {
    name: string;

    init(callback: Callback): void;

    produce(task: P, options: O | null, ): void;

    close(callback: Callback): void;
}

