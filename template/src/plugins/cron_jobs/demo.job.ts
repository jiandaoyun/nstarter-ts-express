import { CronJob } from 'cron';
import { Logger } from 'nstarter-core';
import { BaseCronJob } from './base.job';
import { config } from '../../config';

class DemoCronJob extends BaseCronJob {
    public readonly name = 'demo';
    // Run demo task every one minute
    public readonly cronTime = '0 * * * * *';
    public readonly isAutoStart = true;

    constructor() {
        super();
        this._job = new CronJob({
            cronTime: this.cronTime,
            onTick: () => this.runTask(),
            start: this.isAutoStart,
            timeZone: config.system.timezone
        });
    }

    public runTask() {
        // Run cron job task here.
        Logger.info(`Cron job "${ this.name }" finished.`);
    }
}

export const demoCronJob = new DemoCronJob();
