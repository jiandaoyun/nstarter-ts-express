import _ from 'lodash';
import { injectable } from 'inversify';

import { BaseComponent } from './base.component';
import { Components } from './components';
import * as jobs from '../cron_jobs';
import { BaseCronJob } from '../cron_jobs/base.job';

@injectable()
export class CronComponent extends BaseComponent {
    protected _name = Components.cron;
    private _jobs: Record<string, BaseCronJob> = jobs;

    constructor () {
        super();
        _.forEach(jobs, (cronJob: BaseCronJob) => {
            if (!cronJob.isAutoStart) {
                cronJob.job.start();
            }
        });
        this.log();
    }

    public get jobs() {
        return this._jobs;
    }
}
