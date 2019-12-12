import _ from 'lodash';

import { AbstractComponent } from './abstract.component';
import * as jobs from '../plugins/cron_jobs';
import { BaseCronJob } from '../plugins/cron_jobs/base.job';
import { provideComponent } from '../decorators';

@provideComponent()
export class CronComponent extends AbstractComponent {
    private _jobs: Record<string, BaseCronJob> = jobs;

    constructor() {
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
