import ServiceDaemon from './services';

ServiceDaemon.daemonize(() => {
    if (process.send) {
        process.send('ready');
    }
});

process.on('uncaughtException', (err) => {
    return false;
});
