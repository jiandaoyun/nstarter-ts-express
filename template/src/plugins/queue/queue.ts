import async from 'async';
import { Getter, Setter } from '../../decorators';
import { Errors } from '../../errors';
import { Connection, Replies } from 'amqplib/callback_api';
import { Exchange, Queue, QueueBase, RabbitMQChannel } from './interface';

export abstract class RabbitMQBase implements QueueBase {
    @Getter() @Setter() public channel: RabbitMQChannel;

    protected get _connection(): Connection | undefined {
        return RabbitMQBase.rabbitmq.getConnection();
    }

    protected _createChannel(callback: Callback): void {
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
        const { name, type, options }: Partial<Exchange> = exchange || {};
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
    public close(callback: Callback): void {
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
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        return require('../../components').logger;
    }

    /**
     * 动态加载 rabbitmq compoent
     */
    private static get rabbitmq() {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        return require('../../components').rabbitmq;
    }
}
