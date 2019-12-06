import { ClientSession } from "mongoose";

export abstract class BaseRepo {
    protected readonly _session?: ClientSession;

    constructor (session?: ClientSession) {
        this._session = session;
    }
}

const _defaultServices: {
    [name: string]: BaseRepo
} = {};

export const repoProvider = <T extends BaseRepo>(Service: Constructor<T>) =>
    (sess?: ClientSession): T => {
        if (!sess) {
            const serviceKey = Service.name;
            let service = _defaultServices[serviceKey];
            if (!service) {
                service = new Service();
                _defaultServices[serviceKey] = service;
            }
            return service as T;
        } else {
            return new Service(sess);
        }
    };
