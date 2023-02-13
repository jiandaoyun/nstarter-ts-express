import { demoCronJob } from './demo.job';
import _ from 'lodash';
import { BaseCronJob } from './base.job';

export const cronJobs = [
    demoCronJob
];

/**
 * 启动定时任务
 */
export const startCronJobs = async () => {
    _.forEach(cronJobs, (cronJob: BaseCronJob) => {
        if (!cronJob.isAutoStart) {
            cronJob.job.start();
        }
    });
};
