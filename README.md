# Short Unique ID (UUID) Generating Library
![Tests](https://github.com/jeanlescure/short-unique-id/workflows/tests/badge.svg)
[![Try short-unique-id on RunKit](https://badge.runkitcdn.com/short-unique-id.svg)](https://npm.runkit.com/short-unique-id)
[![NPM Downloads](https://img.shields.io/npm/dt/short-unique-id.svg?maxAge=2592000)](https://npmjs.com/package/short-unique-id)
[![JsDelivr Hits](https://data.jsdelivr.com/v1/package/npm/short-unique-id/badge?style=rounded)](https://www.jsdelivr.com/package/npm/short-unique-id)
[![Deno v1.2.0](https://img.shields.io/badge/deno-v1.2.0-green.svg)](https://deno.land)

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![9 Contributors](https://img.shields.io/badge/all_contributors-8-purple.svg)](#contributors)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

Generate random or sequential UUID of any length.

This project is open to updates by its users, I ensure that PRs are relevant to the community.
In other words, if you find a bug or want a new feature, please help us by becoming one of the
[contributors](#contributors-) ✌️ ! See the [contributing section](#contributing).

## Like this module? ❤

Please consider:

- [Buying me a coffee](https://www.buymeacoffee.com/jeanlescure) ☕
- Supporting me on [Patreon](https://www.patreon.com/jeanlescure) 🏆
- Starring this repo on [Github](https://github.com/jeanlescure/short-unique-id) 🌟

### Use in CLI 🆕

```sh
$ npm install -g short-unique-id

$ short-unique-id -h

# Usage:
#   node short-unique-id [OPTION]

# Options:
#   -l, --length=ARG         character length of the uid to generate.
#       --dictionaryJson=ARG json file with dictionary array.
#   -h, --help               display this help
```

### Use as module

```js
// Deno (web module) Import
import ShortUniqueId from 'https://cdn.jsdelivr.net/npm/short-unique-id@latest/short_uuid/mod.ts';

// ES6 / TypeScript Import
import ShortUniqueId from 'short-unique-id';

//or Node.js require
const { default: ShortUniqueId } = require('short-unique-id');

//Instantiate
const uid = new ShortUniqueId();

// Random UUID
console.log(uid());

// Sequential UUID
console.log(uid.seq());
```

### Use in browser

```html
<!-- Import -->
<script src="https://cdn.jsdelivr.net/npm/short-unique-id@latest/dist/short-unique-id.min.js"></script>

<!-- Usage -->
<script>
  // Instantiate
  var uid = new ShortUniqueId();

  // Random UUID
  document.write(uid());

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

For more information take a look at the [docs](https://shortunique.id/globals.html#options).

## Available for

- [Node.js (npm)](https://www.npmjs.com/package/short-unique-id)
- [Deno](https://deno.land/x/short_uuid/)
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
<a target="_blank" href="https://shortunique.id/classes/shortuniqueid.html#collisionprobability">API Reference</a>.


## V3.x

Version 3.0 is a re-write of this library aiming to use [Deno](https://deno.land/) as the driving
force of the development and distribution of Short Unique ID.

We did this by separating the Deno compatible typescript logic into a [git submodule](https://github.com/jeanlescure/short_uuid)
which gets bundled for the rest of the platforms by the scripts within the
`package.json` in this repo.

Another reason for the re-write was to define a new license for the source
code within this repo, the [Apache 2.0 license](http://www.apache.org/licenses/LICENSE-2.0.html).

## "Deno" who? what?

Ryan Dahl, creator of Node.js, has spent the last couple of years working
on Deno, a new runtime for JavaScript that is supposed to fix all the inherent
problems of Node.

We have tried it out and are convinced that Deno is stable enough and
delivers on all expectations we could have.

For more info check out this [detailed look at Deno from LogRocket's blog](https://blog.logrocket.com/what-is-deno/).

## Acknowledgement and platform support

This repo and npm package started as a straight up manual transpilation to ES6 of the [short-uid](https://github.com/serendipious/nodejs-short-uid) npm package by [Ankit Kuwadekar](https://github.com/serendipious/).

![image depicting over 5000 weekly npm downloads](https://raw.githubusercontent.com/jeanlescure/short-unique-id/master/assets/weekly-downloads.png)

Since this package is now reporting between 4k and 5k+ npm weekly downloads, we've gone ahead and re-written the whole of it in TypeScript and made sure to package lib and dist modules compatible with Deno, Node.js and all major Browsers.

## Development

Clone this repo (including submodules):

```sh
# SSH
git clone --recurse-submodules git@github.com:jeanlescure/short-unique-id.git

# HTTPS
git clone --recurse-submodules https://github.com/jeanlescure/short-unique-id.git
```

All feature development must happen under `./short_uuid/mod.ts`.

Tests run using [Deno](https://deno.land/std/testing/):

```
yarn test
```

Using [airbnb](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base) rules for [tslint](https://palantir.github.io/tslint/):

```
yarn lint
```

## Build

In order to publish the latest changes you must build the library and distribution files:

```
yarn lib:build
yarn dist:build
```

**IMPORTANT**: The `dist:build` script depends on the files generated by `lib:build`.

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
    <td align="center"><a href="https://jeanlescure.cr"><img src="https://shortunique.id/assets/contributors/jeanlescure.svg" /></a><table><tbody><tr><td width="150" align="center"><a href="#maintenance-jeanlescure" title="Maintenance">🚧</a> <a href="https://github.com/jeanlescure/short-unique-id/commits?author=jeanlescure" title="Code">💻</a> <a href="#content-jeanlescure" title="Content">🖋</a> <a href="https://github.com/jeanlescure/short-unique-id/commits?author=jeanlescure" title="Documentation">📖</a> <a href="https://github.com/jeanlescure/short-unique-id/commits?author=jeanlescure" title="Tests">⚠️</a></td></tr></tbody></table></td>
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
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

## License

Copyright (c) 2018-2020 [Short Unique ID Contributors](https://github.com/jeanlescure/short-unique-id/#contributors-).<br/>
Licensed under the Apache License 2.0.