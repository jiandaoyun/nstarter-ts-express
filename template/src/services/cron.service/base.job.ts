import { CronJob } from 'cron';

export abstract class BaseCronJob {
    protected _job: CronJob;
    public readonly isAutoStart: boolean = false;

    public abstract readonly name: string;
    public abstract readonly cronTime: string;

    public get job() {
        return this._job;
    }

    public abstract runTask(): void;
}
