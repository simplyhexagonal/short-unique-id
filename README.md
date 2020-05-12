# Deno Short UUID Module

This is a random UUID generation module which allows you to set your own dictionary and length.

## Platform Support

This repo is pulled as a submodule by the npm package [short-unique-id](https://github.com/jeanlescure/short-unique-id). This allows us to support the following platforms through TypeScript and `deno bundle`:

- [Deno](https://deno.land/x/short_uuid/)
- [Node.js](https://www.npmjs.com/package/short-unique-id)
- [Browsers](https://www.jsdelivr.com/package/npm/short-unique-id?path=dist)

## Documentation

You can find the docs and online generator at:

[https://shortunique.id](https://shortunique.id)

## Example

```js
import ShortUniqueId from 'https://cdn.jsdelivr.net/npm/short-unique-id@latest/short_uuid/mod.ts';

const uid = new ShortUniqueId();

// Random UUID of length 6 (default)
console.log(uid()); // x6trff

// Random UUID of length 12
console.log(uid(12)); // wwL44UU5K0z3

const abUid = new ShortUniqueId({
  dictionary: ['a', 'b'],
  shuffle: false,
});

// Sequential UUID (using internal counter)
console.log(abUid.seq()); // a
console.log(abUid.seq()); // b
console.log(abUid.seq()); // ab
console.log(abUid.seq()); // bb
console.log(abUid.seq()); // aab
// ...

```
