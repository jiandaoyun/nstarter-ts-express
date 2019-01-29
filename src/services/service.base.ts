export abstract class BaseService {
    public abstract name: string;
    public abstract enabled: boolean;
    public wanted: string[] = [];

    public active = false;

    public start (callback: Function): void {
        this.active = true;
        this.log(`${ this.name } service ... ok`);
        return callback();
    }

    public stop (callback: Function): void {
        this.active = false;
        this.log(`${ this.name } service ... stopped`);
        return callback();
    }

    protected log (msg: string): void {
        // TODO logger
        console.log(`[INFO] ${ msg }`);
    }
}
