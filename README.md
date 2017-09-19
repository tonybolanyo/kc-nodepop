# kc-nodepop
KeepCoding Web3 Node module

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



## API endpoints

** List announces **:
    ``/apiv1/advertisements``

Accepted filters:
    ?tag=<tag_name>
    ?type=<sale|buy>
    ?pmin=<price_min>
    ?pmax=<price_max>
    ?name=<part_of_name>

** List tags **:
    ``/apiv1/tags``

