# Short Unique ID Generator
## With ES6 imports, Node.js, and browser support

This is a straight up manual transpilation to ES6 of the [short-uid](https://github.com/serendipious/nodejs-short-uid) npm package by [Ankit Kuwadekar](https://github.com/serendipious/).

## Why?

The above linked repository has gone stale, no updates in the past 2 years (as of writing this README). 

If used in a ES6 environment it fails to follow good `import` standards.

Even so, the functionality is still useful. So here we are.

## Instantiation (Server-side)

Install using npm:

```
npm install --save short-unique-id
```

ES6:

```javascript
// Import
import ShortUniqueId from 'short-unique-id';

// Instantiate
const uid = new ShortUniqueId();
```

Node.js:

```javascript
// Import
var ShortUniqueId = require('short-unique-id');

// Instantiate
var uid = new ShortUniqueId();
```

## Instantiation (Client-side)

Browser:

```html
<!-- Import -->
<script src="https://rawgit.com/jeanlescure/short-unique-id/master/dist/short-unique-id.min.js"></script>

<!-- Instantiate -->
<script>
  var uid = new ShortUniqueId();
</script>
```

## Usage

Once instantiated you can use one of two functions:

```
// Generate Random Unique ID of a specific length
uid.randomUUID(6); // zUvMF8
uid.randomUUID(8); // 4308OPWZ
uid.randomUUID(13); // o0Sf6rfoPOrz5

// Generate Sequential Unique ID based on internal dictionary and counter
uid.sequentialUUID(); // v
uid.sequentialUUID(); // 0
uid.sequentialUUID(); // Y
```

## Development

Tests run using [Jasmine](https://jasmine.github.io/):

```
npm test
```

This will update the `short-unique-id.js` file under `./lib`, which will then be imported by the spec and tested.

Find lint using [airbnb](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base) for [eslint](https://github.com/eslint/eslint):

```
npm run lint
```

## Build

In order to publish the latest changes you must build the distribution files:

```
npm run build
```

This will update the `short-unique-id.js` file under `./lib`, which will then be minified as the `short-unique-id.min.js` file under the `./dist` directory.
