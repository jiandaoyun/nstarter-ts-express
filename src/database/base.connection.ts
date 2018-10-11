export abstract class BaseConnection<ConfigType, ConnectionType> {
    protected readonly _options: ConfigType;
    protected _connected: boolean;
    connection: ConnectionType;

    constructor (options: ConfigType) {
        this._options = options;
    }

    abstract connect(callback: Function): void;
    abstract disconnect(callback: Function): void;
}
