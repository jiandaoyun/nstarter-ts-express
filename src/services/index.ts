import _ from 'lodash';
import async, {
    AsyncAutoTasks,
    AsyncAutoTask,
    Dictionary
} from 'async';
import { BaseService } from './service.base';
import { httpService } from './service.http';
import { mongodbService } from './service.mongodb';
import { i18nService } from './service.i18n';
import { redisService } from './service.redis';
import { webSocketService } from './service.websocket';
import { cronService } from './service.cron';

const services = [
    i18nService,
    mongodbService,
    redisService,
    httpService,
    webSocketService,
    cronService
];

type TasksType = AsyncAutoTasks<Dictionary<any>, Error>;
type TaskType = AsyncAutoTask<never, Dictionary<any>, Error>;

export class ServiceDaemon {
    private _services: BaseService[];
    constructor () {
        this._services = _.filter(services, (service: BaseService) =>
            service.enabled === true
        );
    }

    private get _startTasks () {
        return _.reduce<BaseService, TasksType>(this._services, (tasks, service) => {
            let task: TaskType;
            if (_.isEmpty(service.wanted)) {
                task = (callback) => service.start(callback);
            } else {
                task = [
                    ...service.wanted,
                    (results, callback) => service.start(callback)
                ];
            }
            tasks[service.name] = task;
            return tasks;
        }, {});
    }

    private get _stopTasks () {
        const wantedMap: { [wanted: string]: string[] } = {};
        // Stop services by reversed dependencies.
        _.forEach(this._services, (service) => {
            _.forEach(service.wanted, (wanted) => {
                _.defaults(wantedMap, { [wanted]: [] });
                wantedMap[wanted].push(service.name);
            });
        });
        return _.reduce<BaseService, TasksType>(this._services, (tasks, service) => {
            const wanted = wantedMap[service.name];
            let task: TaskType;
            if (_.isEmpty(wanted)) {
                task = (callback) => service.stop(callback);
            } else {
                task = [
                    ...wanted,
                    (results, callback) => service.stop(callback)
                ];
            }
            tasks[service.name] = task;
            return tasks;
        }, {});
    }

    public startup (callback: Function): void {
        const tasks = this._startTasks;
        if (_.isEmpty(tasks)) {
            console.error('No services to start.');
            return process.exit(1);
        }
        async.auto(tasks, (err) => {
            if (err) {
                return process.exit(1);
            }
            return callback();
        });
    }

    public shutdown (): void {
        const tasks = this._stopTasks;
        if (_.isEmpty(tasks)) {
            return process.exit(0);
        }
        async.auto(tasks, (err) =>
            process.exit(err ? 1 : 0)
        );
    }

    /**
     * Start node.js service daemon
     * @see http://pm2.keymetrics.io/docs/usage/signals-clean-restart/
     */
    public static daemonize (callback: Function): void {
        const daemon = new ServiceDaemon();
        // start services
        daemon.startup(callback);
        // montior process kill events
        process.on('SIGTERM', () => daemon.shutdown());
        process.on('SIGINT', () => daemon.shutdown());
    }
}
