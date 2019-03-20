import _ from 'lodash';
import * as jobs from './jobs';
import { BaseCronJob } from './jobs/base.job';

export function startJobs () {
    _.forEach(jobs, (cronJob: BaseCronJob) => {
        if (!cronJob.isAutoStart) {
            cronJob.job.start();
        }
    });
}

export function stopJobs(){
    _.forEach(jobs, (cronJob: BaseCronJob) => {
        cronJob.job.stop();
    });
}

export {
    jobs
};
