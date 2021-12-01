interface Constructor<T = any> {
    new(...args: any[]): T;
}

interface Callback<T = any, E = Error> {
    (err?: E | null, result?: T): void;
}
