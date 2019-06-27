import _ from 'lodash';
import async from 'async';
import { EventEmitter } from 'events';
import { Getter, Setter } from '../../decorators';
import { Errors } from '../../errors';
import {
    Channel,
    ConfirmChannel,
    Connection,
    ConsumeMessage,
    GetMessage,
    Options,
    Replies
} from 'amqplib/callback_api';
import {
    ChannelMode, ConsumeConfig, ConsumeImpl, ConsumeOptions, ConsumerImpl,
    Exchange, FetchMessage, Message, MessageHandler, ProduceImpl,
    ProduceOptions, ProducerImpl,
    Queue,
    QueueBase,
    RabbitMQChannel, RabbitMQMessage, SubscribeMessage, TaskOptions, TaskPayload
} from './interface';

export abstract class RabbitMQBase implements QueueBase {
    @Getter() @Setter() public channel: RabbitMQChannel;

    protected get _connection(): Connection | undefined {
        return RabbitMQBase.rabbitmq.getConnection();
    }

    protected _createChannel(
        callback: Callback
    ): void {
        if (!this._connection) {
            return callback(Errors.database(100));
        }
        this._connection
            .createChannel((err: Error, channel: RabbitMQChannel): void => {
                if (err) {
                    return callback(err);
                }
                this.channel = channel;
                return callback();
            });
    }

    protected _assertExchange(
        exchange: Exchange | null,
        callback: Callback
    ): void {
        const { name, type, options } = exchange || {} as Exchange;
        if (!name || !type) {
            return callback();
        }
        this.channel
            .assertExchange(name, type, options, (err?: Error) =>
                callback(err, exchange)
            );
    }

    protected _assertQueue(
        queue: Queue,
        callback: Callback
    ): void {
        const { options, exchange, routingKey } = queue;
        async.auto<{
            assertQueue: void,
            assertExchange: Exchange,
            bindQueue: void
        }>({
            assertQueue: (callback) => {
                const name = options.exclusive ? '' : queue.name;
                this.channel
                    .assertQueue(name, options, (err: Error, replies: Replies.AssertQueue) => {
                        if (err) {
                            return callback(err);
                        }
                        if (options.exclusive) {
                            queue.name = replies.queue;
                        }
                        return callback(err);
                    });
            },
            assertExchange: (callback) => {
                if (!exchange) {
                    return callback();
                }
                this._assertExchange(exchange, callback);
            },
            bindQueue: ['assertQueue', 'assertExchange', (results, callback) => {
                if (!exchange) {
                    return callback();
                }
                this.channel
                    .bindQueue(queue.name, exchange.name, routingKey || '', null, (err) =>
                        callback(err)
                    );
            }]
        }, (err) => callback(err, queue));
    }

    public abstract init(callback: Callback): void;

    /**
     * 关闭会话
     */
    public close(
        callback: Callback
    ): void {
        if (!this.channel) {
            return callback();
        }
        this.channel.close((err: Error): void => {
            if (err) {
                return callback(err);
            }
            return callback();
        });
    }

    /**
     * 动态加载 logger component
     */
    protected static get logger() {
        // tslint:disable-next-line:no-require-imports
        return require('../../components').logger;
    }

    /**
     * 动态加载 rabbitmq compoent
     */
    private static get rabbitmq() {
        // tslint:disable-next-line:no-require-imports
        return require('../../components').rabbitmq;
    }
}

/**
 * @class RabbitMQProducer
 * @extends RabbitMQBase
 */
export class RabbitMQProducer extends RabbitMQBase implements ProduceImpl<Queue, ProduceOptions> {
    private readonly _mode: ChannelMode;

    constructor(mode?: ChannelMode) {
        super();
        this._mode = mode || ChannelMode.normal;
    }

    public init(
        callback: Callback
    ): void {
        if (!this._connection) {
            return callback(Errors.database(100));
        }
        if (this._mode === ChannelMode.confirm) {
            // Confirm 模式
            this._connection
                .createConfirmChannel((err: Error, channel: RabbitMQChannel): void => {
                    if (err) {
                        return callback(err);
                    }
                    this.channel = channel;
                    return callback();
                });
        } else {
            super._createChannel(callback);
        }
    }

    /**
     * 发送消息到指定 exchange、routingKey
     */
    public publish(
        queue: Queue,
        content: any,
        options: ProduceOptions,
        callback: Callback
    ): void {
        const { exchange, routingKey } = queue;
        async.auto<{
            exchange: Exchange,
            sendMessage: void
        }>({
            exchange: (callback) => {
                this._assertExchange(exchange, callback);
            },
            sendMessage: ['exchange', (results, callback) => {
                this._sendMessage(exchange.name, routingKey, content, options, callback);
            }]
        }, (err) => callback(err));
    }

    /**
     * 发送消息到指定队列
     */
    public sendToQueue(
        queue: Queue,
        content: any,
        options: ProduceOptions,
        callback: Callback
    ): void {
        async.auto<{
            queue: Queue,
            sendMessage: void
        }>({
            queue: (callback) => {
                this._assertQueue(queue, callback);
            },
            sendMessage: ['queue', (results, callback) => {
                const { routingKey } = results.queue;
                this._sendMessage('', routingKey, content, options, callback);
            }]
        }, (err) => callback(err));
    }

    /**
     * 发送消息到指定 exchange、routingKey
     */
    private _sendMessage(
        exchange: string,
        routingKey: string,
        content: any,
        options: ProduceOptions,
        callback: Callback
    ): void {
        const payload: Buffer = Buffer.from(JSON.stringify(content));
        if (this._mode === ChannelMode.confirm) {
            (this.channel as ConfirmChannel)
                .publish(exchange, routingKey, payload, options, (err?: Error) => {
                    if (err) {
                        return callback(err);
                    }
                    return callback();
                });
        } else {
            (this.channel as Channel).publish(exchange, routingKey, payload, options);
            return callback();
        }
    }
}

export class RabbitMQConsumer extends RabbitMQBase implements ConsumeImpl<Queue, ConsumeOptions, Message> {
    private _consumeTag: string;
    private _queue: Queue;
    private readonly _msgHandler: MessageHandler;

    constructor(config: ConsumeConfig) {
        super();
        this._queue = config.queue;
        this._msgHandler = config.megHandler || RabbitMQConsumer._getDefaultMsgHandler();
    }

    public init(
        callback: Callback
    ): void {
        async.auto<{
            channel: void,
            queue: void
        }>({
            channel: (callback) => {
                super._createChannel(callback);
            },
            queue: ['channel', (results, callback: Function): void => {
                this._assertQueue(this._queue, (err: Error, queue: Queue): void => {
                    if (err) {
                        return callback(err);
                    }
                    this._queue = queue;
                    return callback();
                });
            }]
        }, (err) => callback(err));
    }

    /**
     * PULL 模式，拉取一条队列消息
     */
    public fetch(
        options: ConsumeOptions,
        callback: Callback<FetchMessage | false>
    ): void {
        this.channel
            .get(
                this._queue.name,
                RabbitMQConsumer._getFetchOptions(options),
                (err: Error, message: GetMessage | false) => {
                    if (err) {
                        return callback(err, message);
                    }
                    return this._msgHandler(message, callback);
                }
            );
    }

    /**
     * PUSH 模式，订阅队列消息
     */
    public subscribe(
        options: ConsumeOptions,
        callback: Callback<SubscribeMessage | null>
    ): void {
        this.channel
            .consume(
                this._queue.name,
                (message: ConsumeMessage | null) => {
                    this._msgHandler(message, callback);
                },
                RabbitMQConsumer._getConsumeOptions(options),
                (err: Error, results: Replies.Consume) => {
                    if (err) {
                        RabbitMQBase.logger.warn(err);
                    }
                    this._consumeTag = results.consumerTag;
                }
            );
    }

    public ack(
        message: RabbitMQMessage,
        allUpTo?: boolean
    ): void {
        return this.channel.ack(message, allUpTo);
    }

    public nack(
        message: RabbitMQMessage,
        allUpTo?: boolean,
        requeue?: boolean
    ): void {
        return this.channel.nack(message, allUpTo, requeue);
    }

    public cancel(
        callback: Callback
    ): void {
        if (!this._consumeTag) {
            return callback();
        }
        return this.channel
            .cancel(this._consumeTag, (err?: Error): void => {
                if (err) {
                    return callback(err);
                }
                return callback();
            });
    }

    /**
     * 格式化拉取模式参数配置
     * @private
     */
    private static _getFetchOptions(options: ConsumeOptions): Options.Get {
        return _.defaults(options, {
            noAck: true
        });
    }

    /**
     * 格式化订阅模式参数配置
     * @private
     */
    private static _getConsumeOptions(options: ConsumeOptions): Options.Consume {
        return _.defaults(options, {
            noAck: true
        });
    }

    /**
     * 获取默认消息处理
     * @private
     */
    private static _getDefaultMsgHandler(): MessageHandler {
        return (message: RabbitMQMessage | false | null, callback: Callback<Message>): void => {
            if (!message) {
                return callback(null, message);
            }
            try {
                const content = _.toString(_.get(message, 'content'));
                message.content = JSON.parse(content);
            } catch (e) {
                // TODO error handler
                return callback(e);
            }
            return callback(null, message);
        };
    }
}

export abstract class BaseConsumer extends EventEmitter implements ConsumerImpl {
    protected _running: boolean;

    public init(
        callback: Callback
    ): void {
        this._running = true;
        this.emit('init', this.name);

        return callback();
    }

    public abstract consume(): void;

    public close(
        callback: Callback
    ): void {
        this._running = false;
        this.emit('close', this.name);

        return callback();
    }

    public abstract name: string;
}

export abstract class BaseProducer<P extends TaskPayload = TaskPayload, O extends TaskOptions = TaskOptions>
    extends EventEmitter implements ProducerImpl<P, O> {
    protected _running: boolean;

    public init(
        callback: Callback
    ): void {
        this._running = true;
        this.emit('init', this.name);

        callback();
    }

    public abstract produce(message: P, options: O | null, callback?: Callback): void;

    public close(
        callback: Callback
    ): void {
        this._running = false;
        this.emit('close', this.name);

        return callback();
    }

    public abstract name: string;
}
