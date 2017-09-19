# kc-nodepop
KeepCoding Web3 Node module

## Configure project

First of all clone the repository and install dependencies with npm

```
$ git clone https://github.com/tonybolanyo/kc-nodepop
$ cd kc-nodepop
$ npm install
```

If you don't have a running mongodb server on localhost at the default port (27017) you need to install and launch one or change configuration params to specify one live server.

TODO: insert mongodb info

TODO: insert configuration params how-to


## Setting up initial sample data

You can use `npm run initdb` to clean up `advertisements` collection and populate sample data (16 sample advertisements), from `sample_data.json` file.

This script asumes you have a working mongodb instance running on `localhost` at default mongodb port (27017), and uses `nodepop` as database. When you run the script, it drops any document in `advertisements` collection.

If you want to use a different server, port, database or JSON data file you must change some variables at the begining of the file `init_data.js`:

```js
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;

// Configuration data
const dataFilePath = './sample_data.json';
const mongoServer = {
    url: '127.0.0.1',
    port: '27017',
    database: 'nodepop'
}
// End of configuration data
```

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
$ nodemon
```

in another console:

```
// in project root folder (where gulpfile.js is)
$ gulp
```

Now you can access to http://localhost:8000 to see the home page with the list of advertisements.

# API description

You can explore and test the API running the server and visiting http://localhost:8000/docs or using the Explore API link in the navigation bar.