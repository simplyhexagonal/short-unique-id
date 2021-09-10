// @module ShortUniqueId

// Copyright 2017-2021 the Short Unique ID authors. All rights reserved. Apache 2.0 license.

// @ts-ignore
import {version} from '../package.json';

interface ShortUniqueIdRanges {
  [k: string]: [number, number];
};

type defaultDictionaries = 'number' | 'alpha' | 'alpha_lower' | 'alpha_upper' | 'alphanum' | 'alphanum_lower' | 'alphanum_upper' | 'hex';

/**
 * ```js
 * {
 *   dictionary: ['z', 'a', 'p', 'h', 'o', 'd', ...],
 *   shuffle: false,
 *   debug: false,
 *   length: 6,
 * }
 * ```
 */
export interface ShortUniqueIdOptions {
  /** User-defined character dictionary */
  dictionary: string[] | defaultDictionaries;

  /** If true, sequentialUUID use the dictionary in the given order */
  shuffle: boolean;

  /** If true the instance will console.log useful info */
  debug: boolean;

  /** From 1 to infinity, the length you wish your UUID to be */
  length: number;
};

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
export const DEFAULT_UUID_LENGTH: number = 6;

const DEFAULT_OPTIONS: ShortUniqueIdOptions = {
  dictionary: 'alphanum',
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
export default class ShortUniqueId extends Function {
  static default: typeof ShortUniqueId = ShortUniqueId;

  public counter: number;
  public debug: boolean;
  public dict: string[];
  public version: string;
  public dictIndex: number = 0;
  public dictRange: number[] =[];
  public lowerBound: number = 0;
  public upperBound: number = 0;
  public dictLength: number = 0;
  public uuidLength: number;

  protected _digit_first_ascii: number = 48;
  protected _digit_last_ascii: number = 58;
  protected _alpha_lower_first_ascii: number = 97;
  protected _alpha_lower_last_ascii: number = 123;
  protected _hex_last_ascii: number = 103;
  protected _alpha_upper_first_ascii: number = 65;
  protected _alpha_upper_last_ascii: number = 91;

  protected _number_dict_ranges: ShortUniqueIdRanges = {
    digits: [this._digit_first_ascii, this._digit_last_ascii],
  };

  protected _alpha_dict_ranges: ShortUniqueIdRanges = {
    lowerCase: [this._alpha_lower_first_ascii, this._alpha_lower_last_ascii],
    upperCase: [this._alpha_upper_first_ascii, this._alpha_upper_last_ascii],
  };

  protected _alpha_lower_dict_ranges: ShortUniqueIdRanges = {
    lowerCase: [this._alpha_lower_first_ascii, this._alpha_lower_last_ascii],
  };

  protected _alpha_upper_dict_ranges: ShortUniqueIdRanges = {
    upperCase: [this._alpha_upper_first_ascii, this._alpha_upper_last_ascii],
  };

  protected _alphanum_dict_ranges: ShortUniqueIdRanges = {
    digits: [this._digit_first_ascii, this._digit_last_ascii],
    lowerCase: [this._alpha_lower_first_ascii, this._alpha_lower_last_ascii],
    upperCase: [this._alpha_upper_first_ascii, this._alpha_upper_last_ascii],
  };

  protected _alphanum_lower_dict_ranges: ShortUniqueIdRanges = {
    digits: [this._digit_first_ascii, this._digit_last_ascii],
    lowerCase: [this._alpha_lower_first_ascii, this._alpha_lower_last_ascii],
  };

  protected _alphanum_upper_dict_ranges: ShortUniqueIdRanges = {
    digits: [this._digit_first_ascii, this._digit_last_ascii],
    upperCase: [this._alpha_upper_first_ascii, this._alpha_upper_last_ascii],
  };

  protected _hex_dict_ranges: ShortUniqueIdRanges = {
    decDigits: [this._digit_first_ascii, this._digit_last_ascii],
    alphaDigits: [this._alpha_lower_first_ascii, this._hex_last_ascii],
  };

  /* tslint:disable consistent-return */
  protected log = (...args: any[]): void => {
    const finalArgs = [...args];
    finalArgs[0] = `[short-unique-id] ${args[0]}`;
    /* tslint:disable no-console */
    if (this.debug === true) {
      if (typeof console !== 'undefined' && console !== null) {
        return console.log(...finalArgs);
      }
    }
    /* tslint:enable no-console */
  };
  /* tslint:enable consistent-return */

  /** Change the dictionary after initialization. */
  setDictionary = (dictionary: string[] | defaultDictionaries, shuffle?: boolean): void => {
    let finalDict: string[];

    if (dictionary && Array.isArray(dictionary) && dictionary.length > 1) {
      finalDict = dictionary as string[];
    } else {
      finalDict = [];

      let i;

      this.dictIndex = i = 0;

      const rangesName = `_${dictionary as defaultDictionaries}_dict_ranges`;
      const ranges: ShortUniqueIdRanges = this[rangesName as keyof ShortUniqueId];

      Object.keys(ranges).forEach((rangeType) => {
        const rangeTypeKey = rangeType;

        this.dictRange = ranges[rangeTypeKey];

        this.lowerBound = this.dictRange[0];
        this.upperBound = this.dictRange[1];

        for (
          this.dictIndex = i = this.lowerBound;
          this.lowerBound <= this.upperBound ? i < this.upperBound : i > this.upperBound;
          this.dictIndex = this.lowerBound <= this.upperBound ? i += 1 : i -= 1
        ) {
          finalDict.push(String.fromCharCode(this.dictIndex));
        }
      });
    }

    if (shuffle) {
      // Shuffle Dictionary to remove selection bias.
      const PROBABILITY = 0.5;
      finalDict = finalDict.sort(() => Math.random() - PROBABILITY);
    }

    this.dict = finalDict;

    // Cache Dictionary Length for future usage.
    this.dictLength = this.dict.length;// Resets internal counter.
    this.counter = 0;
  };

  seq = (): string => {
    return this.sequentialUUID();
  };

  /**
   * Generates UUID based on internal counter that's incremented after each ID generation.
   * @alias `const uid = new ShortUniqueId(); uid.seq();`
   */
  sequentialUUID = (): string => {
    let counterDiv: number;
    let counterRem: number;
    let id: string = '';

    counterDiv = this.counter;

    do {
      counterRem = counterDiv % this.dictLength;
      counterDiv = Math.trunc(counterDiv / this.dictLength);
      id += this.dict[counterRem];
    } while (counterDiv !== 0);

    this.counter += 1;

    return id;
  };

  /**
   * Generates UUID by creating each part randomly.
   * @alias `const uid = new ShortUniqueId(); uid(uuidLength: number);`
   */
  randomUUID = (uuidLength: number = this.uuidLength || DEFAULT_UUID_LENGTH): string => {
    let id: string;
    let randomPartIdx: number;
    let j: number;

    if ((uuidLength === null || typeof uuidLength === 'undefined') || uuidLength < 1) {
      throw new Error('Invalid UUID Length Provided');
    }

    const isPositive = uuidLength >= 0;

    // Generate random ID parts from Dictionary.
    id = '';
    for (
      j = 0;
      j < uuidLength;
      j += 1
    ) {
      randomPartIdx = parseInt(
        (Math.random() * this.dictLength).toFixed(0),
        10,
      ) % this.dictLength;
      id += this.dict[randomPartIdx];
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
  availableUUIDs = (uuidLength: number = this.uuidLength): number => {
    return parseFloat(
      Math.pow([...new Set(this.dict)].length, uuidLength).toFixed(0),
    );
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
   * Then `Q(H)` can be approximated as the square root of the product of half
   * of pi times `H`:
   *
   * ![](https://render.githubusercontent.com/render/math?math=%5CHuge%20Q(H)%5Capprox%5Csqrt%7B%5Cfrac%7B%5Cpi%7D%7B2%7DH%7D)
   *
   * This function returns `Q(H)`.
   * 
   * (see [Poisson distribution](https://en.wikipedia.org/wiki/Poisson_distribution))
   */
  approxMaxBeforeCollision = (rounds: number = this.availableUUIDs(this.uuidLength)): number => {
    return parseFloat(
      Math.sqrt((Math.PI / 2) * rounds).toFixed(20),
    );
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
   * of dividing the square root of the product of half of pi times `r` by `H`:
   *
   * ![](https://render.githubusercontent.com/render/math?math=%5CHuge%20p(r%3B%20H)%5Capprox%5Cfrac%7B%5Csqrt%7B%5Cfrac%7B%5Cpi%7D%7B2%7Dr%7D%7D%7BH%7D)
   *
   * This function returns `p(r; H)`.
   * 
   * (see [Poisson distribution](https://en.wikipedia.org/wiki/Poisson_distribution))
   *
   * (Useful if you are wondering _"If I use this lib and expect to perform at most
   * `r` rounds of UUID generations, what is the probability that I will hit a duplicate UUID?"_.)
   */
  collisionProbability = (
    rounds: number = this.availableUUIDs(this.uuidLength),
    uuidLength: number = this.uuidLength,
  ): number => {
    return parseFloat(
      (
        this.approxMaxBeforeCollision(rounds) / this.availableUUIDs(uuidLength)
      ).toFixed(20),
    );
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
  uniqueness = (rounds: number = this.availableUUIDs(this.uuidLength)): number => {
    const score = parseFloat(
      (1 - (
        this.approxMaxBeforeCollision(rounds) / rounds
      )).toFixed(20),
    );
    return (
      score > 1
    ) ? (
      1
    ) : (
      (score < 0) ? 0 : score
    );
  };

  /**
   * Return the version of this module.
   */
  getVersion = (): string => {
    return this.version;
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
  stamp = (finalLength: number): string => {
    if (typeof finalLength !== 'number' || finalLength < 10) {
      throw new Error('Param finalLength must be number greater than 10');
    }

    const hexStamp = Math.floor(+new Date() / 1000).toString(16);

    const idLength = finalLength - 9;

    const rndIdx = Math.round(Math.random() * ((idLength > 15) ? 15 : idLength));

    const id = this.randomUUID(idLength);

    return `${id.substr(0, rndIdx)}${hexStamp}${id.substr(rndIdx)}${rndIdx.toString(16)}`;
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
  parseStamp = (stamp: string): Date => {
    if (stamp.length < 10) {
      throw new Error('Stamp length invalid');
    }

    const rndIdx = parseInt(stamp.substr(stamp.length - 1, 1), 16);

    return new Date(parseInt(stamp.substr(rndIdx, 8), 16) * 1000);
  };

  constructor(argOptions: Partial<ShortUniqueIdOptions> = {}) {
    super();

    const options: ShortUniqueIdOptions = {
      ...DEFAULT_OPTIONS,
      ...argOptions as Partial<ShortUniqueIdOptions>,
    };

    this.counter = 0;
    this.debug = false;
    this.dict = [];
    this.version = version;

    const {
      dictionary,
      shuffle,
      length,
    } = options;

    this.uuidLength = length;

    this.setDictionary(dictionary, shuffle);

    this.debug = options.debug;
    this.log(this.dict);
    this.log((`Generator instantiated with Dictionary Size ${this.dictLength}`));

    return new Proxy(this, {
      apply: (target, that, args) => this.randomUUID(...args),
    });
  }
}
