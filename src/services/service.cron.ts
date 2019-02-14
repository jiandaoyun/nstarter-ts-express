import { BaseService } from './service.base';
import { Services } from './enum';
import { startJobs, stopJobs } from '../cron_job';

export class CronService extends BaseService {
    public name = Services.cron;
    public wanted = [];

    public start (callback: Function) {
        startJobs();
        super.start(callback);
    }

    public stop (callback: Function) {
        stopJobs();
        super.stop(callback);
    }
}

export const cronService = new CronService();
