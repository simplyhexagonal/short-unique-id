# Short Unique ID (UUID) Generating Library

[![Try short-unique-id on RunKit](https://badge.runkitcdn.com/short-unique-id.svg)](https://npm.runkit.com/short-unique-id)
[![NPM Downloads](https://img.shields.io/npm/dt/short-unique-id.svg?maxAge=2592000)](https://npmjs.com/package/short-unique-id)

(Try out the <a target="_blank" href="https://jeanlescure.github.io/short-unique-id/">online generator</a>)

## With ES6 imports, Node.js, and browser support

This started as a straight up manual transpilation to ES6 of the [short-uid](https://github.com/serendipious/nodejs-short-uid) npm package by [Ankit Kuwadekar](https://github.com/serendipious/).

![image depicting over 5000 weekly npm downloads](https://raw.githubusercontent.com/jeanlescure/short-unique-id/master/assets/weekly-downloads.png)

Since my package is now reporting between 4k and 5k+ npm weekly downloads, I've gone ahead and refactored the package using [Neutrino JS](https://neutrinojs.org/).

## V2.x

Version 2.0 was mainly a refactor of the original branch, so functionality and naming conventions have been kept the same.

Even so, there are still **breaking changes**, mainly the removal of the `lib` build output, as well as changes on how to instantiate the library on the browser.

## Instantiation (Server-side)

Install:

```
yarn add short-unique-id
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
const ShortUniqueId = require('short-unique-id').default;

// Instantiate
const uid = new ShortUniqueId();
```

## Instantiation (Client-side)

Browser:

```html
<!-- Import -->
<script src="https://unpkg.com/short-unique-id@latest/dist/short-unique-id.min.js"></script>

<!-- Instantiate -->
<script>
  var ShortUniqueId = window['short-unique-id'].default;
  var uid = new ShortUniqueId({debug: true});
</script>
```

## Options

There are three options available on instantiation:

```javascript
const options = {
  dictionary: ['Z', 'a', 'p', 'h', 'o', 'd' ...], // User-defined dictionary
  skipShuffle: false, // If true, sequentialUUID will iterate over the dictionary in the given order
  debug: false, // If true the instance will console.log useful info
};
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

Tests run using [Jest](https://jestjs.io/):

```
yarn test
```

Using [airbnb](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base) rules for [eslint](https://github.com/eslint/eslint):

```
yarn lint
```

## Build

In order to publish the latest changes you must build the distribution files:

```
yarn build
yarn dist:update
```

This will generate the `short-unique-id.min.js` file under the `./dist` directory.
