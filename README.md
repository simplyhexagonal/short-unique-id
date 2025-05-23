# Short Unique ID (UUID) Generating Library
![Tests](https://github.com/jeanlescure/short-unique-id/workflows/tests/badge.svg?r=OCFIyq)
[![Try short-unique-id on RunKit](https://badge.runkitcdn.com/short-unique-id.svg)](https://npm.runkit.com/short-unique-id)
[![NPM Downloads](https://img.shields.io/npm/dt/short-unique-id.svg?maxAge=2592000)](https://npmjs.com/package/short-unique-id)
[![JsDelivr Hits](https://data.jsdelivr.com/v1/package/npm/short-unique-id/badge?style=rounded)](https://www.jsdelivr.com/package/npm/short-unique-id)

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![18 Contributors](https://img.shields.io/badge/all_contributors-18-purple.svg)](#contributors)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

---

Tiny (6.7kB minified) no-dependency library for generating random or sequential UUID of any length
with exceptionally minuscule probabilies of duplicate IDs.

```ts
const uid = new ShortUniqueId({ length: 10 });
uid.rnd(); // p0ZoB1FwH6
uid.rnd(); // mSjGCTfn8w
uid.rnd(); // yt4Xx5nHMB
// ...

// or

const { randomUUID } = new ShortUniqueId({ length: 10 });
randomUUID(); // e8Civ0HoDy
randomUUID(); // iPjiGoHXAK
randomUUID(); // n528gSMwTN
// ...
```

For example, using the default dictionary of numbers and letters (lower and upper case):

```ts
  0,1,2,3,4,5,6,7,8,9,
  a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,
  A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z
```

- if you generate a unique ID of 16 characters (half of the standard UUID of 32 characters)
- generating 100 unique IDs **per second**

#### It would take **~10 thousand years** to have a 1% probability of at least one collision!

To put this into perspective:

- 73 years is the (global) average life expectancy of a human being
- 120 years ago no human ever had set foot on either of the Earth's poles
- 480 years ago Nicolaus Copernicus was still working on his theory of the Earth revolving around the Sun
- 1000 years ago there was no such thing as government-issued paper money (and wouldn't be for about a century)
- 5000 years ago the global population of humans was under 50 million (right now Mexico has a population of 127 million)

You can calculate duplicate/collision probabilities using the included functions:

- [availableUUIDs()](https://shortunique.id/classes/ShortUniqueId.html#availableUUIDs)
- [approxMaxBeforeCollision()](https://shortunique.id/classes/ShortUniqueId.html#approxMaxBeforeCollision)
- [collisionProbability()](https://shortunique.id/classes/ShortUniqueId.html#collisionProbability)

_NOTE: 👆 On these links you will also find explanations for the math used within the functions._

---

## Open source notice

This project is part of the [Open Collective](https://opencollective.com/simplyhexagonal) project [Simply Hexagonal](https://simplyhexagonal.org)
and is open to updates by its users, we ensure that PRs are relevant to the community.
In other words, if you find a bug or want a new feature, please help us by becoming one of the
[contributors](#contributors-) ✌️ ! See the [contributing section](#contributing).

## Like this module? ❤

Please consider:

- [Buying me a coffee](https://www.buymeacoffee.com/jeanlescure) ☕
- Supporting me on [Patreon](https://www.patreon.com/jeanlescure) 🏆
- Starring this repo on [Github](https://github.com/jeanlescure/short-unique-id) 🌟

## 📣 v5 Notice

In order to improve security compliance we have removed the ability to use a ShortUniqueId as a
function, i.e. `const uid = new ShortUniqueId(); uid();` is no longer supported.

If you plan to upgrade to v5 make sure to refactor `uid();` to `uid.rnd();` in your code beforehand.

For more information regarding this decision you can view [issue #53](https://github.com/simplyhexagonal/short-unique-id/issues/53).

### Features

#### Ability to generate UUIDs that contain a timestamp which can be extracted:

```js
// js/ts

const uid = new ShortUniqueId();

const uidWithTimestamp = uid.stamp(32);
console.log(uidWithTimestamp);
// GDa608f973aRCHLXQYPTbKDbjDeVsSb3

const recoveredTimestamp = uid.parseStamp(uidWithTimestamp);
console.log(recoveredTimestamp);
// 2021-05-03T06:24:58.000Z
```

```bash
# cli

$ suid -s -l 42

  lW611f30a2ky4276g3l8N7nBHI5AQ5rCiwYzU47HP2

$ suid -p lW611f30a2ky4276g3l8N7nBHI5AQ5rCiwYzU47HP2

  2021-08-20T04:33:38.000Z
```

#### Default dictionaries (generated on the spot to reduce memory footprint and avoid dictionary injection vulnerabilities):

- number
- alpha
- alpha_lower
- alpha_upper
- **alphanum** _(default when no dictionary is provided to `new ShortUniqueId()`)_
- alphanum_lower
- alphanum_upper
- hex

```js
// instantiate using one of the default dictionary strings
const uid = new ShortUniqueId({
  dictionary: 'hex',
});

console.log(uid.dict.join());
// 0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f

// or change the dictionary after instantiation
uid.setDictionary('alpha_upper');

console.log(uid.dict.join());
// A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z
```

#### Ability to use custom formatting

Where `$r` is random UUID, `$s` is sequential UUID, and `$t` is timestamp UUID:

```js
const timestamp = new Date('4-01-29T03:21:21.000Z');
const result = uid.formattedUUID('Time: $t0 ID: $s2-$r4', timestamp); // timestamp is optional

console.log(result);
// Time: 63d5e631 ID: 0b-aaab
```

#### Ability to validate UUIDs against the instance dictionary or a provided dictionary

Example of using .validate() method:

```js
// Instantiate using one of the default dictionary strings
const uid = new ShortUniqueId({
  dictionary: 'hex',
});

const uuid = uid.stamp(32); // Generate a UUID

// Validate the generated UUID against the instance dictionary
const isValid = uid.validate(uuid);

console.log(`Is the UUID valid? ${isValid}`);

// ---

// Validate the generated UUID against the provided dictionary
const customDictionary = ['a', 'b', /* ... */];
const isValid = uid.validate(uuid, customDictionary);

console.log(`Is the UUID valid? ${isValid}`);
```

### Use in CLI

```sh
$ npm install --global short-unique-id

$ suid -h

# Usage:
#   node short-unique-id [OPTION]
# 
# Options:
#   -l, --length=ARG         character length of the uid to generate.
#   -s, --stamp              include timestamp in uid (must be used with --length (-l) of 10 or more).
#   -t, --timestamp=ARG      custom timestamp to parse (must be used along with -s, --stamp, -f, or --format).
#   -f, --format=ARG         string representing custom format to generate id with.
#   -p, --parse=ARG          extract timestamp from stamped uid (ARG).
#   -d, --dictionaryJson=ARG json file with dictionary array.
#   -h, --help               display this help
```

### Use as module

Add to your project:

```js
// ES6 / TypeScript Import
import ShortUniqueId from 'short-unique-id';

// Node.js require
const ShortUniqueId = require('short-unique-id');

// Deno (web module) Import
import ShortUniqueId from 'https://esm.sh/short-unique-id';
```

Instantiate and use:

```js
//Instantiate
const uid = new ShortUniqueId();

// Random UUID
console.log(uid.rnd());

// Sequential UUID
console.log(uid.seq());
```

alternatively using destructuring assignment:

```js
// Instantiate and destructure (long method name recommended for code readability)
const { randomUUID, sequentialUUID } = new ShortUniqueId();

// Random UUID
console.log(randomUUID());

// Sequential UUID
console.log(sequentialUUID());
```

_NOTE:_ we made sure to use `bind()` on all ShortUniqueId methods to ensure that any options
passed when creating the instance will be respected by the destructured methods.

### Use in browser

```html
<!-- Add source (minified 4.6kB) -->
<script src="https://cdn.jsdelivr.net/npm/short-unique-id@latest/dist/short-unique-id.min.js"></script>

<!-- Usage -->
<script>
  // Instantiate
  var uid = new ShortUniqueId();

  // Random UUID
  document.write(uid.rnd());

  // Sequential UUID
  document.write(uid.seq());
</script>
```

### Options

Options can be passed when instantiating `uid`:

```js
const options = { ... };

const uid = new ShortUniqueId(options);
```

For more information take a look at the [docs](https://shortunique.id/interfaces/shortuniqueidoptions.html).

## Available for

- [Node.js (npm)](https://www.npmjs.com/package/short-unique-id)
- [Deno](https://esm.sh/short-unique-id)
- [Browsers](https://www.jsdelivr.com/package/npm/short-unique-id?path=dist)

## Documentation with Online Short UUID Generator

You can find the docs and online generator at:

<a target="_blank" href="https://shortunique.id">https://shortunique.id</a>

## What is the probability of generating the same id again?

This largely depends on the given dictionary and the selected UUID length.

Out of the box this library provides a shuffled dictionary of digits from
0 to 9, as well as the alphabet from a to z both in UPPER and lower case,
with a default UUID length of 6. That gives you a total of 56,800,235,584
possible UUIDs.

So, given the previous values, the probability of generating a duplicate
in 1,000,000 rounds is ~0.00000002, or about 1 in 50,000,000.

If you change the dictionary and/or the UUID length then we have provided
the function `collisionProbability()` function to calculate the probability
of hitting a duplicate in a given number of rounds (a collision) and the
function `uniqueness()` which provides a score (from 0 to 1) to rate the 
"quality" of the combination of given dictionary and UUID length (the closer
to 1, higher the uniqueness and thus better the quality).

To find out more about the math behind these functions please refer to the
<a target="_blank" href="https://shortunique.id/classes/ShortUniqueId.html#collisionProbability">API Reference</a>.

## Acknowledgement and platform support

This repo and npm package started as a straight up manual transpilation to ES6 of the [short-uid](https://github.com/serendipious/nodejs-short-uid) npm package by [Ankit Kuwadekar](https://github.com/serendipious/).

![image depicting over 200000 weekly npm downloads](https://raw.githubusercontent.com/jeanlescure/short-unique-id/main/assets/weekly-downloads.png)
![image depicting over 16000000 weekly cdn hits](https://raw.githubusercontent.com/jeanlescure/short-unique-id/main/assets/weekly-cdn-hits.png)

Since this package is now reporting 200k+ npm weekly downloads and 16M+ weekly cdn hits,
we've gone ahead and re-written the whole of it in TypeScript and made sure to package
dist modules compatible with Deno, Node.js and all major Browsers.

## Sponsors

- [Clever Synapse](https://cleversynapse.com)

## Development

Clone this repo:

```sh
# SSH
git clone git@github.com:jeanlescure/short-unique-id.git

# HTTPS
git clone https://github.com/jeanlescure/short-unique-id.git
```

Tests run using:

```
pnpm test
```

## Build

In order to publish the latest changes you must build the distribution files:

```
pnpm build
```

Then commit all changes and run the release script:

```
pnpm release
```

## Contributing

Yes, thank you! This plugin is community-driven, most of its features are from different authors.
Please update the docs and tests and add your name to the `package.json` file.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/serendipious"><img src="https://shortunique.id/assets/contributors/serendipious.svg" /></a><table><tbody><tr><td width="150" align="center"><a href="https://github.com/jeanlescure/short-unique-id/commits?author=serendipious" title="Code">💻</a></td></tr></tbody></table></td>
    <td align="center"><a href="https://jeanlescure.cr"><img src="https://shortunique.id/assets/contributors/jeanlescure.svg" /></a><table><tbody><tr><td width="150" align="center"><a href="#maintenance-jeanlescure" title="Maintenance">🚧</a> <a href="https://github.com/jeanlescure/short-unique-id/commits?author=jeanlescure" title="Code">💻</a> <a href="https://github.com/jeanlescure/short-unique-id/commits?author=jeanlescure" title="Documentation">📖</a> <a href="https://github.com/jeanlescure/short-unique-id/commits?author=jeanlescure" title="Tests">⚠️</a></td></tr></tbody></table></td>
    <td align="center"><a href="https://dianalu.design"><img src="https://shortunique.id/assets/contributors/dilescure.svg" /></a><table><tbody><tr><td width="150" align="center"><a href="https://github.com/jeanlescure/short_uuid/commits?author=DiLescure" title="Code">💻</a></td></tr></tbody></table></td>
    <td align="center"><a href="https://github.com/EmerLM"><img src="https://shortunique.id/assets/contributors/emerlm.svg" /></a><table><tbody><tr><td width="150" align="center"><a href="https://github.com/jeanlescure/short_uuid/commits?author=EmerLM" title="Code">💻</a></td></tr></tbody></table></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/angelnath26"><img src="https://shortunique.id/assets/contributors/angelnath26.svg" /></a><table><tbody><tr><td width="150" align="center"><a href="https://github.com/jeanlescure/short_uuid/commits?author=angelnath26" title="Code">💻</a> <a href="https://github.com/jeanlescure/short_uuid/pulls?q=is%3Apr+reviewed-by%3Aangelnath26" title="Reviewed Pull Requests">👀</a></td></tr></tbody></table></td>
    <td align="center"><a href="https://twitter.com/jeffturcotte"><img src="https://shortunique.id/assets/contributors/jeffturcotte.svg" /></a><table><tbody><tr><td width="150" align="center"><a href="https://github.com/jeanlescure/short-unique-id/commits?author=jeffturcotte" title="Code">💻</a></td></tr></tbody></table></td>
    <td align="center"><a href="https://github.com/neversun"><img src="https://shortunique.id/assets/contributors/neversun.svg" /></a><table><tbody><tr><td width="150" align="center"><a href="https://github.com/jeanlescure/short-unique-id/commits?author=neversun" title="Code">💻</a></td></tr></tbody></table></td>
    <td align="center"><a href="https://github.com/ekelvin"><img src="https://shortunique.id/assets/contributors/ekelvin.svg" /></a><table><tbody><tr><td width="150" align="center"><a href="https://github.com/jeanlescure/short-unique-id/issues/19" title="Ideas, Planning, & Feedback">🤔</a></td></tr></tbody></table></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/anthony-arnold"><img src="https://shortunique.id/assets/contributors/anthony-arnold.svg" /></a><table><tbody><tr><td width="150" align="center"><a href="https://github.com/jeanlescure/short-unique-id/issues/35" title="Security">🛡️</a></td></tr></tbody></table></td>
    <td align="center"><a href="https://github.com/ColdtQ"><img src="https://shortunique.id/assets/contributors/coldtq.svg" /></a><table><tbody><tr><td width="150" align="center"><a href="https://github.com/jeanlescure/short-unique-id/pull/46" title="Code">💻</a></td></tr></tbody></table></td>
    <td align="center"><a href="https://github.com/char0n"><img src="https://shortunique.id/assets/contributors/char0n.svg" /></a><table><tbody><tr><td width="150" align="center"><a href="https://github.com/jeanlescure/short-unique-id/pull/48" title="Code">💻</a></td></tr></tbody></table></td>
    <td align="center"><a href="https://github.com/mybuddymichael"><img src="https://shortunique.id/assets/contributors/mybuddymichael.svg" /></a><table><tbody><tr><td width="150" align="center"><a href="https://github.com/jeanlescure/short-unique-id/issues/47" title="Documentation">📖</a></td></tr></tbody></table></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/irfancnk"><img src="https://shortunique.id/assets/contributors/irfancnk.svg" /></a><table><tbody><tr><td width="150" align="center"><a href="https://github.com/jeanlescure/short-unique-id/issues/52" title="Review">👀</a></td></tr></tbody></table></td>
    <td align="center"><a href="https://github.com/apottere"><img src="https://shortunique.id/assets/contributors/apottere.svg" /></a><table><tbody><tr><td width="150" align="center"><a href="https://github.com/jeanlescure/short-unique-id/issues/59" title="Review">👀</a></td></tr></tbody></table></td>
    <td align="center"><a href="https://github.com/bambuchaAdm"><img src="https://shortunique.id/assets/contributors/bambuchaAdm.svg" /></a><table><tbody><tr><td width="150" align="center"><a href="https://github.com/jeanlescure/short-unique-id/issues/59" title="Review">👀</a></td></tr></tbody></table></td>
    <td align="center"><a href="https://github.com/lstarkgv"><img src="https://shortunique.id/assets/contributors/lstarkgv.svg" /></a><table><tbody><tr><td width="150" align="center"><a href="https://github.com/jeanlescure/short-unique-id/issues/60" title="Review">👀</a></td></tr></tbody></table></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/mbehr1"><img src="https://shortunique.id/assets/contributors/mbehr1.svg" /></a><table><tbody><tr><td width="150" align="center"><a href="https://github.com/jeanlescure/short-unique-id/issues/61" title="Review">👀</a></td></tr></tbody></table></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

## License

Copyright (c) 2018-2025 [Short Unique ID Contributors](https://github.com/jeanlescure/short-unique-id/#contributors-).<br/>
Licensed under the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).
