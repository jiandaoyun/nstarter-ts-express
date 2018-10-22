/// <reference types="express-session" />
/// <reference types="ioredis" />

declare module "connect-redis" {
    import { SessionOptions, RequestHandler, Store } from "express-session";
    import { Redis } from "ioredis";

    function s(options: (options?: SessionOptions) => RequestHandler): s.RedisStore;

    namespace s {
        interface RedisStore extends connectRedis.RedisStore {
            new (options: StoreOptions): Store;
        }

        interface StoreOptions extends RedisStoreOptions {
            client?: Redis
        }
    }

    export = s;
}
