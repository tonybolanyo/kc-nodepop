# Nodepop reference

**Nodepop** is a test project to try a simple API for a Wallapop like application backend.

## Configure project

First of all clone the repository and install dependencies with npm

```shell
$ git clone https://github.com/tonybolanyo/kc-nodepop
$ cd kc-nodepop
$ npm install
```

### Database configuration

By default, app asumes you have a working mongodb instance on localhost in the default port. You can change connection details in several ways:

1. You can set environment variables
2. You can use `.env` file to set this environment variables, as shown in `.env.sample`. The variables are:

```
NODEPOP_DBHOST=127.0.0.1
NODEPOP_PORT=27017
NODEPOP_DBUSER=username
NODEPOP_DBPASSWORD=password
```

If your database desn need any user/password configuration, just ignore these variables.

If you don't have a running mongodb server on localhost at the default port you need to install and launch one or change configuration params to specify one live server.

If you need more information on mongodb you can visit the official documentation:

- [Install mongodb](https://docs.mongodb.com/manual/installation/)
- [Manage mongod processes](https://docs.mongodb.com/manual/tutorial/manage-mongodb-processes/)


## Setting up initial sample data

You can use `npm run installdata` to clean up `advertisements` collection and populate sample data (16 sample advertisements), from `data/sample_data.json` file, insert two sample users and installs some pictures for advertisements in `public/images/advertisements` folder. You can login with this users using their emails (tony@example.com or user@example.com) and the password *1234*.

This script uses the same mongodb configuration data. When you run the script, it drops any document in `advertisements` and `users` collections.

`sample_data.json` contains an array of advertisements with fields:

- **name**: string. Article name. Used as advertisement title.
- **price**: numeric. Sale price or max. price for searches (in dollars).
- **isSale**: boolean. true for sales, false for wanted articles.
- **tags**: array of strings. Only "work", "lifestyle", "mobile" and "motor" are valid tags.
- **picture**: string. Name of an image file for article. Image must exists in public/images/advertisements when server is running. Any image on src/images/advertisement will be optimized and copied to this folder if you use gulp to start server.


## Setting up AMQP and thumbnailer

Every advertisement picture will be resized to be a square image of 550 pixels width and height. Resizing is done on background by a second process called `thumbnailer`. First of all you must configure an AMQP Server like CloudAMQP which uses RabbitMQ (read more at https://www.cloudamqp.com).

Once your AMQP service is ready you need the connection URL beginning with `amqp://...` to be able to connect with the service. Put that URL on `AMQP_URL` environment variable (in your system or in `.env` file) and launch `thumbnailer` process:

```
$ npm run thumbnailer
```

When you upload a picture for an advertisement thumbnailer will take it from uploads folder, resize and save it in `public/images/advertisements/' folder.

By default, thumbnailer uses a queue named 'resize' but you can customize it using the environment variable `NODEPOP_THUMB_QUEUE`.



## Running server for develop

Once everything is configured you should run express with nodemon and gulp tasks to start server and watch source folders for any change. Nodemon and browser-sync reload server or browser with changes so you don't need to reload manually.

```
// in project root folder (where package.json is)
$ npm run dev
```

This command run express through nodemon on port `3003` through `PORT` environment variable and set `NODE_ENV` environment variable to `development` and `gulp` to build the frontend from `src` folder to `public` folder and set up browser-sync as a proxy to access express.

Now you can access to http://localhost:3000 to see the home page with the home page of the website showing the list of advertisements.

## Running end to end test suite

This project use supertest, mocha and chai to run some test cases and verify the integrity of the API routes.

To run end to end test suite you only need to run this command in the project root folder (the directory where `package.json` is located):

```
$ npm run e2e
```

After a few seconds you should see all tests passing.

## Running in production

To simulate run server in production follow these steps:

- build frontend: `gulp build`
- run thumbnailer: `npm run thumbnailer`
- run server: `npm server`

# API description

API documentation is made using [JSDoc](http://usejsdoc.org/) comments to generate API definitions with [Swagger](https://swagger.io/).

You can explore and test the API running the server and visiting http://localhost:3000/docs/api or using the Explore API link in the navigation bar, in development or in production.

# Code style

The project uses linting for JavaScript and SASS files:

- [**ESLint**](https://eslint.org/) for JavaScript linting
- [**Stylelint**](https://stylelint.io/) for SASS linting

When you run default gulp task, any linting error on SASS will be informed in the console and any JavaScript linting error will stop the build process.

If you want to lint only your code from the command line you can do it in two ways:

- with gulp: `gulp js:lint`
- with npm: `npm lint`

# Internationalization (i18n)

Only error messages will be translated to user language. All the localization is made by **i18n** package. Translate function `__` is register as global function so you don't need to use require in every module.

Language is taken from `accepted-language` HTTP header in every request or by `lang` param in the query string.

For further information [see **i18n** documentation](https://github.com/mashpie/i18n-node).

**A note about validation messages on mongoose models:**

Mongoose models are compile on app init with this lines in `app.js`:

```
[...]
// import mongoose model schemas
require('./models/Advertisement');
[...]
```

At this point i18n is using `defaultLocale` configuration value as active language, (`en` value, actually). Altough you use i18n `__` function you will not see translated messages. You must use i18n `__` to show messages (as `customError` does), but why do you use `__` function on validation messages then?

OK, I configured i18n to auto updated language files, so you need use it here to this feature works.

# User authentication

Only post new articles is protected with user credentials.

NodePop uses JSON Web Token to manage user authentication. The JWT token can be provided to server by one of this methods:

1. As HTTP header `x-access-token`
2. In the body as `token` param
3. In hte query string as `token` param