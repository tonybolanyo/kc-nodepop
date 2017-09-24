# Nodepop reference

Nodepop is a test project to try a simple API for a Wallapop like application backend.

## Configure project

First of all clone the repository and install dependencies with npm

```shell
$ git clone https://github.com/tonybolanyo/kc-nodepop
$ cd kc-nodepop
$ npm install
```

### Database configuration

By default, app asumes you have a working mongodb instance on localhost in the default port. You can change connection details in `config/database.js` file. Default params are:

```js
mongodb: {
    host: '127.0.0.1',
    port: '27017',
    database: 'nodepop'
}
```

If you don't have a running mongodb server on localhost at the default port you need to install and launch one or change configuration params to specify one live server.

TODO: insert mongodb info


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

This command run express through nodemon on port `3003` through `PORT` environment variable and set `NODE_ENV` environment variable to `development`.

in another console:

```
// in project root folder (where gulpfile.js is)
$ gulp
```

This command build the frontend from `src` folder to `public` folder and set up browser-sync as a proxy to access express.

Now you can access to http://localhost:3000 to see the home page with the home page of the website showing the list of advertisements.

# API description

API documentation is made using JSDoc comments to generate API definitions with Swagger.

You can explore and test the API running the server and visiting http://localhost:3000/docs/api or using the Explore API link in the navigation bar, in development or in production.

# Code style

The project uses linting for JavaScript and SASS files:

- [**ESLint**](https://eslint.org/) for JavaScript linting
- [**Stylelint**](https://stylelint.io/) for SASS linting

When you run default gulp task, any linting error on SASS will be informed in the console and any JavaScript linting error will stop the build process.

If you want to lint only your code from the command line you can do it in two ways:

- with gulp: `gulp js:lint`
- with npm: `npm lint`

# Internazionalization (i18n)

Only error messages will be translated to user language. All the localization is made by **i18n** package. Translate function `__` is register as global function so you don't need to use require in every module.

Language is taken from `accepted-language` HTTP header in every request or by `lang` param in the query string.

For further information [see **i18n** documentation](https://github.com/mashpie/i18n-node).