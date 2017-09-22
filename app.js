const express = require('express');
const path = require('path');
//var favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');

const index = require('./routes/index');

const app = express();

// connect to db
require('./lib/mongooseConnection');

// import mongoose model schemas
require('./models/Advertisement');

// import swaggerJSDoc
const swaggerSpec = require('./lib/swaggerJSDocConfig');

// Configure i18n
const i18n = require('i18n');
i18n.configure({
    locales:['en', 'es'],
    defaultLocale: 'en',
    directory: __dirname + '/locales',
    queryParameter: 'lang',
    autoReload: true,
    syncFiles: true,
    register: global,
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(i18n.init); // use i18n after cookie parser
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/apiv1/tags', require('./routes/apiv1/tags'));
app.use('/apiv1/advertisements', require('./routes/apiv1/advertisements'));

// serve swagger JSON API definition
app.get('/swagger.json', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(require('./lib/customError'));

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
