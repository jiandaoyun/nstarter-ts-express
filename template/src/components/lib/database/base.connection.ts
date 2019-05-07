export abstract class BaseConnection<ConfigType, ConnectionType> {
    protected readonly _options: ConfigType;
    public connection: ConnectionType;

    constructor (options: ConfigType) {
        this._options = options;
    }
}
