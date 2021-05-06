(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.ShortUniqueId = factory());
}(this, (function () { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spreadArray(to, from) {
        for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
            to[j] = from[i];
        return to;
    }

    var version = "4.3.3";

    // @module ShortUniqueId
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
    var DEFAULT_UUID_LENGTH = 6;
    var DEFAULT_OPTIONS = {
        dictionary: 'alphanum',
        shuffle: true,
        debug: false,
        length: DEFAULT_UUID_LENGTH
    };
    /**
     * Generate random or sequential UUID of any length.
     *
     * ### Use as module
     *
     * ```js
     * // Deno (web module) Import
     * import ShortUniqueId from 'https://cdn.jsdelivr.net/npm/short-unique-id@latest/src/index.ts';
     *
     * // ES6 / TypeScript Import
     * import ShortUniqueId from 'short-unique-id';
     *
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
     * <script src="https://cdn.jsdelivr.net/npm/short-unique-id@latest/dist/short-unique-id.min.js"></script>
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
     * For more information take a look at the [ShortUniqueIdOptions type definition](/interfaces/shortuniqueidoptions.html).
     */
    var ShortUniqueId = /** @class */ (function (_super) {
        __extends(ShortUniqueId, _super);
        function ShortUniqueId(argOptions) {
            if (argOptions === void 0) { argOptions = {}; }
            var _this = _super.call(this) || this;
            _this.dictIndex = 0;
            _this.dictRange = [];
            _this.lowerBound = 0;
            _this.upperBound = 0;
            _this.dictLength = 0;
            _this._digit_first_ascii = 48;
            _this._digit_last_ascii = 58;
            _this._alpha_lower_first_ascii = 97;
            _this._alpha_lower_last_ascii = 123;
            _this._hex_last_ascii = 103;
            _this._alpha_upper_first_ascii = 65;
            _this._alpha_upper_last_ascii = 91;
            _this._number_dict_ranges = {
                digits: [_this._digit_first_ascii, _this._digit_last_ascii]
            };
            _this._alpha_dict_ranges = {
                lowerCase: [_this._alpha_lower_first_ascii, _this._alpha_lower_last_ascii],
                upperCase: [_this._alpha_upper_first_ascii, _this._alpha_upper_last_ascii]
            };
            _this._alpha_lower_dict_ranges = {
                lowerCase: [_this._alpha_lower_first_ascii, _this._alpha_lower_last_ascii]
            };
            _this._alpha_upper_dict_ranges = {
                upperCase: [_this._alpha_upper_first_ascii, _this._alpha_upper_last_ascii]
            };
            _this._alphanum_dict_ranges = {
                digits: [_this._digit_first_ascii, _this._digit_last_ascii],
                lowerCase: [_this._alpha_lower_first_ascii, _this._alpha_lower_last_ascii],
                upperCase: [_this._alpha_upper_first_ascii, _this._alpha_upper_last_ascii]
            };
            _this._alphanum_lower_dict_ranges = {
                digits: [_this._digit_first_ascii, _this._digit_last_ascii],
                lowerCase: [_this._alpha_lower_first_ascii, _this._alpha_lower_last_ascii]
            };
            _this._alphanum_upper_dict_ranges = {
                digits: [_this._digit_first_ascii, _this._digit_last_ascii],
                upperCase: [_this._alpha_upper_first_ascii, _this._alpha_upper_last_ascii]
            };
            _this._hex_dict_ranges = {
                decDigits: [_this._digit_first_ascii, _this._digit_last_ascii],
                alphaDigits: [_this._alpha_lower_first_ascii, _this._hex_last_ascii]
            };
            /* tslint:disable consistent-return */
            _this.log = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var finalArgs = __spreadArray([], __read(args));
                finalArgs[0] = "[short-unique-id] " + args[0];
                /* tslint:disable no-console */
                if (_this.debug === true) {
                    if (typeof console !== 'undefined' && console !== null) {
                        return console.log.apply(console, __spreadArray([], __read(finalArgs)));
                    }
                }
                /* tslint:enable no-console */
            };
            /* tslint:enable consistent-return */
            /** Change the dictionary after initialization. */
            _this.setDictionary = function (dictionary, shuffle) {
                var finalDict;
                if (dictionary && Array.isArray(dictionary) && dictionary.length > 1) {
                    finalDict = dictionary;
                }
                else {
                    finalDict = [];
                    var i_1;
                    _this.dictIndex = i_1 = 0;
                    var rangesName = "_" + dictionary + "_dict_ranges";
                    var ranges_1 = _this[rangesName];
                    Object.keys(ranges_1).forEach(function (rangeType) {
                        var rangeTypeKey = rangeType;
                        _this.dictRange = ranges_1[rangeTypeKey];
                        _this.lowerBound = _this.dictRange[0];
                        _this.upperBound = _this.dictRange[1];
                        for (_this.dictIndex = i_1 = _this.lowerBound; _this.lowerBound <= _this.upperBound ? i_1 < _this.upperBound : i_1 > _this.upperBound; _this.dictIndex = _this.lowerBound <= _this.upperBound ? i_1 += 1 : i_1 -= 1) {
                            finalDict.push(String.fromCharCode(_this.dictIndex));
                        }
                    });
                }
                if (shuffle) {
                    // Shuffle Dictionary to remove selection bias.
                    var PROBABILITY_1 = 0.5;
                    finalDict = finalDict.sort(function () { return Math.random() - PROBABILITY_1; });
                }
                _this.dict = finalDict;
                // Cache Dictionary Length for future usage.
                _this.dictLength = _this.dict.length; // Resets internal counter.
                _this.counter = 0;
            };
            _this.seq = function () {
                return _this.sequentialUUID();
            };
            /**
             * Generates UUID based on internal counter that's incremented after each ID generation.
             * @alias `const uid = new ShortUniqueId(); uid.seq();`
             */
            _this.sequentialUUID = function () {
                var counterDiv;
                var counterRem;
                var id = '';
                counterDiv = _this.counter;
                do {
                    counterRem = counterDiv % _this.dictLength;
                    counterDiv = Math.trunc(counterDiv / _this.dictLength);
                    id += _this.dict[counterRem];
                } while (counterDiv !== 0);
                _this.counter += 1;
                return id;
            };
            /**
             * Generates UUID by creating each part randomly.
             * @alias `const uid = new ShortUniqueId(); uid(uuidLength: number);`
             */
            _this.randomUUID = function (uuidLength) {
                if (uuidLength === void 0) { uuidLength = _this.uuidLength || DEFAULT_UUID_LENGTH; }
                var id;
                var randomPartIdx;
                var j;
                if ((uuidLength === null || typeof uuidLength === 'undefined') || uuidLength < 1) {
                    throw new Error('Invalid UUID Length Provided');
                }
                // Generate random ID parts from Dictionary.
                id = '';
                for (j = 0; j < uuidLength; j += 1) {
                    randomPartIdx = parseInt((Math.random() * _this.dictLength).toFixed(0), 10) % _this.dictLength;
                    id += _this.dict[randomPartIdx];
                }
                // Return random generated ID.
                return id;
            };
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
            _this.availableUUIDs = function (uuidLength) {
                if (uuidLength === void 0) { uuidLength = _this.uuidLength; }
                return parseFloat(Math.pow(__spreadArray([], __read(new Set(_this.dict))).length, uuidLength).toFixed(0));
            };
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
            _this.approxMaxBeforeCollision = function (rounds) {
                if (rounds === void 0) { rounds = _this.availableUUIDs(_this.uuidLength); }
                return parseFloat(Math.sqrt((Math.PI / 2) * rounds).toFixed(20));
            };
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
            _this.collisionProbability = function (rounds, uuidLength) {
                if (rounds === void 0) { rounds = _this.availableUUIDs(_this.uuidLength); }
                if (uuidLength === void 0) { uuidLength = _this.uuidLength; }
                return parseFloat((_this.approxMaxBeforeCollision(rounds) / _this.availableUUIDs(uuidLength)).toFixed(20));
            };
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
            _this.uniqueness = function (rounds) {
                if (rounds === void 0) { rounds = _this.availableUUIDs(_this.uuidLength); }
                var score = parseFloat((1 - (_this.approxMaxBeforeCollision(rounds) / rounds)).toFixed(20));
                return (score > 1) ? (1) : ((score < 0) ? 0 : score);
            };
            /**
             * Return the version of this module.
             */
            _this.getVersion = function () {
                return _this.version;
            };
            /**
             * Generates a UUID with a timestamp that can be extracted using `uid.parseStamp(stampString);`.
             *
             * ```js
             *  const uidWithTimestamp = uid.stamp(32);
             *  console.log(uidWithTimestamp);
             *  // GDa608f973aRCHLXQYPTbKDbjDeVsSb3
             *
             *  console.log(uid.parseStamp(uidWithTimestamp));
             *  // 2021-05-03T06:24:58.000Z
             *  ```
             */
            _this.stamp = function (finalLength) {
                if (typeof finalLength !== 'number' || finalLength < 10) {
                    throw new Error('Param finalLength must be number greater than 10');
                }
                var hexStamp = Math.floor(+new Date() / 1000).toString(16);
                var idLength = finalLength - 9;
                var rndIdx = Math.round(Math.random() * ((idLength > 15) ? 15 : idLength));
                var id = _this.randomUUID(idLength);
                return "" + id.substr(0, rndIdx) + hexStamp + id.substr(rndIdx) + rndIdx.toString(16);
            };
            /**
             * Extracts the date embeded in a UUID generated using the `uid.stamp(finalLength);` method.
             *
             * ```js
             *  const uidWithTimestamp = uid.stamp(32);
             *  console.log(uidWithTimestamp);
             *  // GDa608f973aRCHLXQYPTbKDbjDeVsSb3
             *
             *  console.log(uid.parseStamp(uidWithTimestamp));
             *  // 2021-05-03T06:24:58.000Z
             *  ```
             */
            _this.parseStamp = function (stamp) {
                if (stamp.length < 10) {
                    throw new Error('Stamp length invalid');
                }
                var rndIdx = parseInt(stamp.substr(stamp.length - 1, 1), 16);
                return new Date(parseInt(stamp.substr(rndIdx, 8), 16) * 1000);
            };
            var options = __assign(__assign({}, DEFAULT_OPTIONS), argOptions);
            _this.counter = 0;
            _this.debug = false;
            _this.dict = [];
            _this.version = version;
            var dictionary = options.dictionary, shuffle = options.shuffle, length = options.length;
            _this.uuidLength = length;
            _this.setDictionary(dictionary, shuffle);
            _this.debug = options.debug;
            _this.log(_this.dict);
            _this.log(("Generator instantiated with Dictionary Size " + _this.dictLength));
            return new Proxy(_this, {
                apply: function (target, that, args) { return _this.randomUUID.apply(_this, __spreadArray([], __read(args))); }
            });
        }
        ShortUniqueId["default"] = ShortUniqueId;
        return ShortUniqueId;
    }(Function));

    return ShortUniqueId;

})));
//# sourceMappingURL=short-unique-id.js.map
