import async from 'async';
import { AbstractComponent } from './abstract.component';
import { RabbitMQComponent } from './rabbitmq.component';
import { demoConsumer, demoSubscribe } from '../plugins/queue';
import { logger } from './lib/logger';
import { injectComponent, provideComponent } from '../decorators';

@provideComponent()
export class MQConsumerComponent extends AbstractComponent {
    @injectComponent()
    private _rabbitMqComponent: RabbitMQComponent;

    constructor() {
        super();
        this.log();
    }

    public start(): void {
        async.auto<any>({
            // 连接 RabbitMQ Server
            prepare: (callback) => {
                this._rabbitMqComponent
                    .rabbitmq
                    .connect(callback);
            },
            // 创建 Demo 消费者
            initConsumer: ['prepare', (results, callback) =>
                demoConsumer.init(callback)
            ],
            initSubscribe: ['prepare', (results, callback) =>
                demoSubscribe.init(callback)
            ],
            // PULL 模式接受消息
            consume: ['initConsumer', (results, callback) => {
                demoConsumer.consume();
                return callback();
            }],
            // PUSH 模式接受消息
            subscribe: ['initSubscribe', (results, callback) => {
                demoSubscribe.consume();
                return callback();
            }]
        }, (err?: Error) => {
            if (err) {
                logger.error(err);
            } else {
                logger.info('mq consumer start ... ok');
            }
        });
    }

    public stop(): void {
        async.auto<any>({
            stopConsumer: (callback) =>
                demoConsumer.close(callback),
            stopSubscribe: (callback) =>
                demoSubscribe.close(callback)
        }, (err?: Error) => {
            if (err) {
                logger.error(err);
            } else {
                logger.info('mq consumer stop ... ok');
            }
        });
    }
}
