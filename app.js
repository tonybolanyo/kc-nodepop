const express = require('express');
const path = require('path');
//var favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const app = express();

// import swaggerJSDoc
const swaggerSpec = require('./config/swagger');
const i18n = require('./config/i18n')();
// connect to db
require('./lib/mongooseConnection');

// import mongoose model schemas
require('./models/Advertisement');
require('./models/User');

// import login controller
const loginController = require('./routes/loginController');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// allow disable or change logger format using LOG_FORMAT env variable
if (process.env.LOG_FORMAT != 'nolog') {
    app.use(logger(process.env.LOG_FORMAT || 'dev'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(i18n.init); // use i18n after cookie parser
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', require('./routes/index'));
app.use('/lang', require('./routes/lang'));
app.get('/login', loginController.index);
app.post('/login', loginController.post);
app.use('/apiv1/tags', require('./routes/apiv1/tags'));
app.use('/apiv1/advertisements', require('./routes/apiv1/advertisements'));

// serve swagger JSON API definition
app.get('/swagger.json', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});
app.use('/docs', require('./routes/docs'));
app.use('/docs/api', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error(__('Not Found'));
    err.status = 404;
    next(err);
});

app.use(require('./lib/customError'));

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.locals.title = 'Nodepop error';

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
