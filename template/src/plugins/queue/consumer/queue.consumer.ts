import _ from 'lodash';
import { ConsumeMessage, GetMessage, Options, Replies } from 'amqplib';
import async from 'async';
import { EventEmitter } from 'events';

import {
    ConsumeConfig,
    ConsumeImpl,
    ConsumeOptions, ConsumerImpl,
    FetchMessage,
    Message,
    MessageHandler,
    Queue, RabbitMQMessage,
    SubscribeMessage
} from '../interface';
import { RabbitMQBase } from '../queue';

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
            queue: ['channel', (results, callback: Callback): void => {
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

    /**
     * 取消消息订阅
     * @param {Callback} callback - 回调函数
     */
    public unsubscribe(callback: Callback): void {
        if (!this._consumeTag) {
            return callback();
        }
        this.channel
            .cancel(this._consumeTag, (err?: Error) => {
                if (err) {
                    return callback(err);
                }
                return callback();
            });
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
