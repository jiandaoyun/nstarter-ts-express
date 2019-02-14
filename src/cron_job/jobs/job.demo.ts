import { CronJob } from 'cron';
import { BaseCronJob } from './job.base';
import { logger } from '../../logger';

class DemoCronJob extends BaseCronJob {
    public readonly name = 'demo';
    // Run demo task every one minute
    public readonly cronTime = '* */1 * * * *';
    public readonly isAutoStart = true;

    constructor () {
        super();
        this._job = new CronJob({
            cronTime: this.cronTime,
            onTick: this.runTask,
            start: this.isAutoStart
        });
    }

    public runTask () {
        // Run cron job task here.
        logger.info(`Cron job "${ this.name }" finished.`);
    }
}

export const demoCronJob = new DemoCronJob();
