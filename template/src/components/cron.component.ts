import _ from 'lodash';
import { component } from 'nstarter-core';

import * as jobs from '../plugins/cron_jobs';
import { BaseCronJob } from '../plugins/cron_jobs/base.job';
import { AbstractComponent } from './abstract.component';

@component()
export class CronComponent extends AbstractComponent {
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
