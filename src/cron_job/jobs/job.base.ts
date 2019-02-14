import { CronJob } from 'cron';

export abstract class BaseCronJob {
    public abstract readonly name: string;
    public abstract readonly cronTime: string;
    public readonly isAutoStart: boolean = false;
    protected _job: CronJob;

    public get job () {
        return this._job;
    }

    public abstract runTask(): void;
}
