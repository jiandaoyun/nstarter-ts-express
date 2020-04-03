import { ClientSession } from "mongoose";

export abstract class BaseRepo {
    protected readonly _session?: ClientSession;

    constructor (session?: ClientSession) {
        this._session = session;
    }
}

const _defaultRepositories: {
    [name: string]: BaseRepo
} = {};

export const repoProvider = <T extends BaseRepo>(Repository: Constructor<T>) =>
    (sess?: ClientSession): T => {
        if (!sess) {
            const repoKey = Repository.name;
            let repo = _defaultRepositories[repoKey];
            if (!repo) {
                repo = new Repository();
                _defaultRepositories[repoKey] = repo;
            }
            return repo as T;
        } else {
            return new Repository(sess);
        }
    };
