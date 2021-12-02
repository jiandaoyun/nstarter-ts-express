import _ from 'lodash';
import { BaseComponent, component } from 'nstarter-core';

import * as jobs from '../plugins/cron_jobs';
import { BaseCronJob } from '../plugins/cron_jobs/base.job';

@component()
export class CronComponent extends BaseComponent {
    private _jobs: Record<string, BaseCronJob> = jobs;

    constructor() {
        super();
        _.forEach(jobs, (cronJob: BaseCronJob) => {
            if (!cronJob.isAutoStart) {
                cronJob.job.start();
            }
        });
        this.setReady(true);
    }

    public get jobs() {
        return this._jobs;
    }
}
