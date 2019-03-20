export abstract class BaseConnection<ConfigType, ConnectionType> {
    protected readonly _options: ConfigType;
    protected _connected: boolean;
    public connection: ConnectionType;

    constructor (options: ConfigType) {
        this._options = options;
    }

    public abstract connect(callback: Function): void;
    public abstract disconnect(callback: Function): void;
}
