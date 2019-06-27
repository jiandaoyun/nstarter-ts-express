import async from 'async';
import { AbstractComponent } from './abstract.component';
import { provideComponent } from './container';
import { demoProducer, demoConsumer } from '../plugins/queue';
import { logger } from './index';

@provideComponent()
export class QueueComponent extends AbstractComponent {
    constructor() {
        super();
        this.log();
    }

    public start(): void {
        async.auto<any>({
            initProducer: (callback) =>
                demoProducer.init(callback),
            initConsumer: (callback) =>
                demoConsumer.init(callback),
            produce: ['initProducer', 'initConsumer', (results, callback) => {
                async.each(
                    ['demo01', 'demo02', 'demo03', 'demo04', 'demo05'],
                    (content: string, callback: Callback) => {
                        demoProducer.produce({ content }, {}, callback);
                    },
                    (err?: Error) => {
                        if (err) {
                            logger.warn(err);
                        }
                        return callback();
                    }
                );
            }],
            consume: ['produce', (results, callback) => {
                demoConsumer.consume();
                return callback();
            }]
        }, (err?: Error) => {
            if (err) {
                logger.error(err);
            } else {
                logger.info('queue start ... ok');
            }
        });
    }

    public stop(): void {
        async.auto<any>({
            stopProducer: (callback) =>
                demoProducer.close(callback),
            stopConsumer: (callback) =>
                demoConsumer.close(callback)
        }, (err?: Error) => {
            if (err) {
                logger.error(err);
            } else {
                logger.info('queue stop ... ok');
            }
        });
    }
}
