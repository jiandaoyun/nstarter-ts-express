import express from 'express';
import cookieParser from 'cookie-parser';
import { router } from 'routes';

const app = express();

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

module.exports = app;
