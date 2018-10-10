import http from 'http';
import express from 'express';
import cookieParser from 'cookie-parser';
import { router } from './routes';

export const app = express();

// view engine setup
app.set('views', './views');
app.set('view engine', 'pug');

// parser setup
app.use(express.json({
    limit: '1mb'
}));
app.use(express.urlencoded({
    limit: '1mb',
    extended: false
}));
app.use(cookieParser());

// static file path
app.use(express.static('./public'));

app.use('/', router);

// start http server
export const server = http.createServer(app);
const port = 3000;
server.listen(port);
server.on('error', (err) => {
    console.error(err.stack);
    process.exit(1);
});
server.on('listening', () => {
    console.log(`Listening on：${ port }`);
});
