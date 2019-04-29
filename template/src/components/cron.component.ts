import _ from 'lodash';

import { BaseComponent } from './base.component';
import * as jobs from '../cron_jobs';
import { BaseCronJob } from '../cron_jobs/base.job';
import { provideComponent } from './container';

@provideComponent()
export class CronComponent extends BaseComponent {
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
