var __suid_module = 
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";Object.defineProperty(exports, "__esModule", {value: true});// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

// This is a specialised implementation of a System module loader.

// @ts-nocheck
/* eslint-disable */
let System, __instantiateAsync, __instantiate;

(() => {
  const r = new Map();

  System = {
    register(id, d, f) {
      r.set(id, { d, f, exp: {} });
    },
  };

  async function dI(mid, src) {
    let id = mid.replace(/\.\w+$/i, "");
    if (id.includes("./")) {
      const [o, ...ia] = id.split("/").reverse(),
        [, ...sa] = src.split("/").reverse(),
        oa = [o];
      let s = 0,
        i;
      while ((i = ia.shift())) {
        if (i === "..") s++;
        else if (i === ".") break;
        else oa.push(i);
      }
      if (s < sa.length) oa.push(...sa.slice(s));
      id = oa.reverse().join("/");
    }
    return r.has(id) ? gExpA(id) : Promise.resolve().then(() => require(mid));
  }

  function gC(id, main) {
    return {
      id,
      import: (m) => dI(m, id),
      meta: { url: id, main },
    };
  }

  function gE(exp) {
    return (id, v) => {
      v = typeof id === "string" ? { [id]: v } : id;
      for (const [id, value] of Object.entries(v)) {
        Object.defineProperty(exp, id, {
          value,
          writable: true,
          enumerable: true,
        });
      }
    };
  }

  function rF(main) {
    for (const [id, m] of r.entries()) {
      const { f, exp } = m;
      const { execute: e, setters: s } = f(gE(exp), gC(id, id === main));
      delete m.f;
      m.e = e;
      m.s = s;
    }
  }

  async function gExpA(id) {
    if (!r.has(id)) return;
    const m = r.get(id);
    if (m.s) {
      const { d, e, s } = m;
      delete m.s;
      delete m.e;
      for (let i = 0; i < s.length; i++) s[i](await gExpA(d[i]));
      const r = e();
      if (r) await r;
    }
    return m.exp;
  }

  function gExp(id) {
    if (!r.has(id)) return;
    const m = r.get(id);
    if (m.s) {
      const { d, e, s } = m;
      delete m.s;
      delete m.e;
      for (let i = 0; i < s.length; i++) s[i](gExp(d[i]));
      e();
    }
    return m.exp;
  }

  __instantiateAsync = async (m) => {
    System = __instantiateAsync = __instantiate = undefined;
    rF(m);
    return gExpA(m);
  };

  __instantiate = (m) => {
    System = __instantiateAsync = __instantiate = undefined;
    rF(m);
    return gExp(m);
  };
})();

System.register("version", [], function (exports_1, context_1) {
  "use strict";
  var __moduleName = context_1 && context_1.id;
  return {
    setters: [],
    execute: function () {
      exports_1("default", "3.0.0-rc2");
    },
  };
});
System.register("mod", ["version"], function (exports_2, context_2) {
  "use strict";
  var version_ts_1,
    DEFAULT_UUID_LENGTH,
    DIGIT_FIRST_ASCII,
    DIGIT_LAST_ASCII,
    ALPHA_LOWER_FIRST_ASCII,
    ALPHA_LOWER_LAST_ASCII,
    ALPHA_UPPER_FIRST_ASCII,
    ALPHA_UPPER_LAST_ASCII,
    DICT_RANGES,
    DEFAULT_OPTIONS,
    ShortUniqueId;
  var __moduleName = context_2 && context_2.id;
  return {
    setters: [
      function (version_ts_1_1) {
        version_ts_1 = version_ts_1_1;
      },
    ],
    execute: function () {
      /**
             * 6 was chosen as the default UUID length since for most cases
             * it will be more than aptly suitable to provide millions of UUIDs
             * with a very low probability of producing a duplicate UUID.
             *
             * For example, with a dictionary including digits from 0 to 9,
             * as well as the alphabet from a to z both in UPPER and lower case,
             * the probability of generating a duplicate in 1,000,000 rounds
             * is ~0.00000002, or about 1 in 50,000,000.
             */
      DEFAULT_UUID_LENGTH = 6;
      DIGIT_FIRST_ASCII = 48;
      DIGIT_LAST_ASCII = 58;
      ALPHA_LOWER_FIRST_ASCII = 97;
      ALPHA_LOWER_LAST_ASCII = 123;
      ALPHA_UPPER_FIRST_ASCII = 65;
      ALPHA_UPPER_LAST_ASCII = 91;
      DICT_RANGES = {
        digits: [DIGIT_FIRST_ASCII, DIGIT_LAST_ASCII],
        lowerCase: [ALPHA_LOWER_FIRST_ASCII, ALPHA_LOWER_LAST_ASCII],
        upperCase: [ALPHA_UPPER_FIRST_ASCII, ALPHA_UPPER_LAST_ASCII],
      };
      DEFAULT_OPTIONS = {
        dictionary: [],
        shuffle: true,
        debug: false,
        length: DEFAULT_UUID_LENGTH,
      };
      /**
             * Generate random or sequential UUID of any length.
             *
             * ### Use as module
             *
             * ```js
             * // Deno (web module) Import
             * import ShortUniqueId from 'https://cdn.jsdelivr.net/npm/short-unique-id@3.0.0-rc1/short_uuid/mod.ts';
             * // ES6 Import
             * import ShortUniqueId from 'short-unique-id';
             * //or Node.js require
             * const ShortUniqueId = require('short-unique-id');
             *
             * //Instantiate
             * const uid = new ShortUniqueId();
             *
             * // Random UUID
             * console.log(uid());
             *
             * // Sequential UUID
             * console.log(uid.seq());
             * ```
             *
             * ### Use in browser
             *
             * ```html
             * <!-- Import -->
             * <script src="https://cdn.jsdelivr.net/npm/short-unique-id@3.0.0-rc1/dist/short-unique-id.min.js"></script>
             *
             * <!-- Usage -->
             * <script>
             *   // Instantiate
             *   var uid = new ShortUniqueId();
             *
             *   // Random UUID
             *   document.write(uid());
             *
             *   // Sequential UUID
             *   document.write(uid.seq());
             * </script>
             * ```
             *
             * ### Options
             *
             * Options can be passed when instantiating `uid`:
             *
             * ```js
             * const options = { ... };
             *
             * const uid = new ShortUniqueId(options);
             * ```
             *
             * For more information take a look at the [Options type definition](/globals.html#options).
             */
      ShortUniqueId = class ShortUniqueId extends Function {
        /* tslint:enable consistent-return */
        constructor(argOptions = {}) {
          super("...args", "return this.randomUUID(...args)");
          this.dictIndex = 0;
          this.dictRange = [];
          this.lowerBound = 0;
          this.upperBound = 0;
          this.dictLength = 0;
          const options = {
            ...DEFAULT_OPTIONS,
            ...argOptions,
          };
          this.counter = 0;
          this.debug = false;
          this.dict = [];
          this.version = version_ts_1.default;
          const { dictionary: userDict, shuffle, length } = options;
          this.uuidLength = length;
          if (userDict && userDict.length > 1) {
            this.setDictionary(userDict);
          } else {
            let i;
            this.dictIndex = i = 0;
            Object.keys(DICT_RANGES).forEach((rangeType) => {
              const rangeTypeKey = rangeType;
              this.dictRange = DICT_RANGES[rangeTypeKey];
              this.lowerBound = this.dictRange[0];
              this.upperBound = this.dictRange[1];
              for (
                this.dictIndex = i = this.lowerBound;
                this.lowerBound <= this.upperBound
                  ? i < this.upperBound
                  : i > this.upperBound;
                this.dictIndex = this.lowerBound <= this.upperBound
                  ? i += 1
                  : i -= 1
              ) {
                this.dict.push(String.fromCharCode(this.dictIndex));
              }
            });
          }
          if (shuffle) {
            // Shuffle Dictionary for removing selection bias.
            const PROBABILITY = 0.5;
            this.setDictionary(
              this.dict.sort(() => Math.random() - PROBABILITY),
            );
          } else {
            this.setDictionary(this.dict);
          }
          this.debug = options.debug;
          this.log(this.dict);
          this.log(
            (`Generator instantiated with Dictionary Size ${this.dictLength}`),
          );
          const instance = this.bind(this);
          Object.getOwnPropertyNames(this).forEach((prop) => {
            if (!(/arguments|caller|callee|length|name|prototype/).test(prop)) {
              const propKey = prop;
              instance[prop] = this[propKey];
            }
          });
          return instance;
        }
        /* tslint:disable consistent-return */
        log(...args) {
          const finalArgs = [...args];
          finalArgs[0] = `[short-unique-id] ${args[0]}`;
          /* tslint:disable no-console */
          if (this.debug === true) {
            if (typeof console !== "undefined" && console !== null) {
              return console.log(...finalArgs);
            }
          }
          /* tslint:enable no-console */
        }
        /** Change the dictionary after initialization. */
        setDictionary(dictionary) {
          this.dict = dictionary;
          // Cache Dictionary Length for future usage.
          this.dictLength = this.dict.length; // Resets internal counter.
          this.counter = 0;
        }
        seq() {
          return this.sequentialUUID();
        }
        /**
                 * Generates UUID based on internal counter that's incremented after each ID generation.
                 * @alias `const uid = new ShortUniqueId(); uid.seq();`
                 */
        sequentialUUID() {
          let counterDiv;
          let counterRem;
          let id = "";
          counterDiv = this.counter;
          /* tslint:disable no-constant-condition */
          while (true) {
            counterRem = counterDiv % this.dictLength;
            counterDiv = Math.trunc(counterDiv / this.dictLength);
            id += this.dict[counterRem];
            if (counterDiv === 0) {
              break;
            }
          }
          /* tslint:enable no-constant-condition */
          this.counter += 1;
          return id;
        }
        /**
                 * Generates UUID by creating each part randomly.
                 * @alias `const uid = new ShortUniqueId(); uid(uuidLength: number);`
                 */
        randomUUID(uuidLength = this.uuidLength || DEFAULT_UUID_LENGTH) {
          let id;
          let randomPartIdx;
          let j;
          let idIndex;
          if (
            (uuidLength === null || typeof uuidLength === "undefined") ||
            uuidLength < 1
          ) {
            throw new Error("Invalid UUID Length Provided");
          }
          // Generate random ID parts from Dictionary.
          id = "";
          for (
            idIndex = j = 0;
            0 <= uuidLength ? j < uuidLength : j > uuidLength;
            idIndex = 0 <= uuidLength ? j += 1 : j -= 1
          ) {
            randomPartIdx =
              parseInt((Math.random() * this.dictLength).toFixed(0), 10) %
                this.dictLength;
            id += this.dict[randomPartIdx];
          }
          // Return random generated ID.
          return id;
        }
        /**
                 * Calculates total number of possible UUIDs.
                 *
                 * Given that:
                 *
                 * - `H` is the total number of possible UUIDs
                 * - `n` is the number of unique characters in the dictionary
                 * - `l` is the UUID length
                 *
                 * Then `H` is defined as `n` to the power of `l`:
                 *
                 * ![](https://render.githubusercontent.com/render/math?math=%5CHuge%20H=n%5El)
                 *
                 * This function returns `H`.
                 */
        availableUUIDs(uuidLength = this.uuidLength) {
          return parseFloat(
            Math.pow([...new Set(this.dict)].length, uuidLength).toFixed(0),
          );
        }
        /**
                 * Calculates approximate number of hashes before first collision.
                 *
                 * Given that:
                 *
                 * - `H` is the total number of possible UUIDs, or in terms of this library,
                 * the result of running `availableUUIDs()`
                 * - the expected number of values we have to choose before finding the
                 * first collision can be expressed as the quantity `Q(H)`
                 *
                 * Then `Q(H)` can be approximated as the square root of the of the product
                 * of half of pi times `H`:
                 *
                 * ![](https://render.githubusercontent.com/render/math?math=%5CHuge%20Q(H)%5Capprox%5Csqrt%7B%5Cfrac%7B%5Cpi%7D%7B2%7DH%7D)
                 *
                 * This function returns `Q(H)`.
                 */
        approxMaxBeforeCollision(
          rounds = this.availableUUIDs(this.uuidLength),
        ) {
          return parseFloat(Math.sqrt((Math.PI / 2) * rounds).toFixed(20));
        }
        /**
                 * Calculates probability of generating duplicate UUIDs (a collision) in a
                 * given number of UUID generation rounds.
                 *
                 * Given that:
                 *
                 * - `r` is the maximum number of times that `randomUUID()` will be called,
                 * or better said the number of _rounds_
                 * - `H` is the total number of possible UUIDs, or in terms of this library,
                 * the result of running `availableUUIDs()`
                 *
                 * Then the probability of collision `p(r; H)` can be approximated as the result
                 * of dividing the square root of the of the product of half of pi times `H` by `H`:
                 *
                 * ![](https://render.githubusercontent.com/render/math?math=%5CHuge%20p(r%3B%20H)%5Capprox%5Cfrac%7B%5Csqrt%7B%5Cfrac%7B%5Cpi%7D%7B2%7Dr%7D%7D%7BH%7D)
                 *
                 * This function returns `p(r; H)`.
                 *
                 * (Useful if you are wondering _"If I use this lib and expect to perform at most
                 * `r` rounds of UUID generations, what is the probability that I will hit a duplicate UUID?"_.)
                 */
        collisionProbability(
          rounds = this.availableUUIDs(this.uuidLength),
          uuidLength = this.uuidLength,
        ) {
          return parseFloat(
            (this.approxMaxBeforeCollision(rounds) /
              this.availableUUIDs(uuidLength)).toFixed(20),
          );
        }
        /**
                 * Calculate a "uniqueness" score (from 0 to 1) of UUIDs based on size of
                 * dictionary and chosen UUID length.
                 *
                 * Given that:
                 *
                 * - `H` is the total number of possible UUIDs, or in terms of this library,
                 * the result of running `availableUUIDs()`
                 * - `Q(H)` is the approximate number of hashes before first collision,
                 * or in terms of this library, the result of running `approxMaxBeforeCollision()`
                 *
                 * Then `uniqueness` can be expressed as the additive inverse of the probability of
                 * generating a "word" I had previously generated (a duplicate) at any given iteration
                 * up to the the total number of possible UUIDs expressed as the quotiend of `Q(H)` and `H`:
                 *
                 * ![](https://render.githubusercontent.com/render/math?math=%5CHuge%201-%5Cfrac%7BQ(H)%7D%7BH%7D)
                 *
                 * (Useful if you need a value to rate the "quality" of the combination of given dictionary
                 * and UUID length. The closer to 1, higher the uniqueness and thus better the quality.)
                 */
        uniqueness(rounds = this.availableUUIDs(this.uuidLength)) {
          const score = parseFloat(
            (1 - (this.approxMaxBeforeCollision(rounds) / rounds)).toFixed(20),
          );
          return (score > 1) ? (1) : ((score < 0) ? 0 : score);
        }
        /**
                 * Return the version of this module.
                 */
        getVersion() {
          return this.version;
        }
      };
      exports_2("default", ShortUniqueId);
    },
  };
});

const __exp = __instantiate("mod");
exports. default = __exp["default"];

},{}]},{},[1]);
var ShortUniqueId = __suid_module(1)["default"];
