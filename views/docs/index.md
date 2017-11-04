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

1. You can set two environmet variables
2. You can use `.env` file to set this two environment variables, as shown in `.env.sample`. The two variables are:

```
NODEPOP_DBHOST=127.0.0.1
NODEPOP_PORT=27017
```

If you don't have a running mongodb server on localhost at the default port you need to install and launch one or change configuration params to specify one live server.

If you need more information on mongodb you can visit the official documentation:

- [Install mongodb](https://docs.mongodb.com/manual/installation/)
- [Manage mongod processes](https://docs.mongodb.com/manual/tutorial/manage-mongodb-processes/)


## Setting up initial sample data

You can use `npm run installdb` to clean up `advertisements` collection and populate sample data (16 sample advertisements), from `data/sample_data.json` file.

This script uses the same mongodb configuration data. When you run the script, it drops any document in `advertisements` collection.

`sample_data.json` contains an array of advertisements with fields:

- **name**: string. Article name. Used as advertisement title.
- **price**: numeric. Sale price or max. price for searches (in dollars).
- **isSale**: boolean. true for sales, false for wanted articles.
- **tags**: array of strings. Only "work", "lifestyle", "mobile" and "motor" are valid tags.
- **picture**: string. Name of an image file for article. Image must exists in public/images/advertisements when server is running. Any image on src/images/advertisement will be optimized and copied to this folder if you use gulp to start server.


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