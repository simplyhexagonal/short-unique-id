/**
 * @packageDocumentation
 **/

// Copyright 2017-2022 the Short Unique ID authors. All rights reserved. Apache 2.0 license.

// @ts-ignore
import {version} from '../package.json';

export interface ShortUniqueIdRanges {
  [k: string]: [number, number];
};

export interface ShortUniqueIdRangesMap {
  [k: string]: ShortUniqueIdRanges;
};

export type ShortUniqueIdDefaultDictionaries = 'number' | 'alpha' | 'alpha_lower' | 'alpha_upper' | 'alphanum' | 'alphanum_lower' | 'alphanum_upper' | 'hex';

/**
 * ```js
 * {
 *   dictionary: ['z', 'a', 'p', 'h', 'o', 'd', ...],
 *   shuffle: false,
 *   debug: false,
 *   length: 6,
 * }
 * ```
 * <br/>
 * @see {@link DEFAULT_OPTIONS}
 */
export interface ShortUniqueIdOptions {
  /** User-defined character dictionary */
  dictionary: string[] | ShortUniqueIdDefaultDictionaries;

  /** If true, sequentialUUID use the dictionary in the given order */
  shuffle: boolean;

  /** If true the instance will console.log useful info */
  debug: boolean;

  /** From 1 to infinity, the length you wish your UUID to be */
  length: number;

  /** From 0 to infinity, the current value for the sequential UUID counter */
  counter: number;
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

export const DEFAULT_OPTIONS: ShortUniqueIdOptions = {
  dictionary: 'alphanum',
  shuffle: true,
  debug: false,
  length: DEFAULT_UUID_LENGTH,
  counter: 0,
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
 * // or Node.js require
 * const ShortUniqueId = require('short-unique-id');
 *
 * // Instantiate
 * const uid = new ShortUniqueId();
 *
 * // Random UUID
 * console.log(uid.rnd());
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
 *   document.write(uid.rnd());
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
export default class ShortUniqueId {
  /** @hidden */
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

  protected _dict_ranges: ShortUniqueIdRangesMap = {
    _number_dict_ranges: this._number_dict_ranges,
    _alpha_dict_ranges: this._alpha_dict_ranges,
    _alpha_lower_dict_ranges: this._alpha_lower_dict_ranges,
    _alpha_upper_dict_ranges: this._alpha_upper_dict_ranges,
    _alphanum_dict_ranges: this._alphanum_dict_ranges,
    _alphanum_lower_dict_ranges: this._alphanum_lower_dict_ranges,
    _alphanum_upper_dict_ranges: this._alphanum_upper_dict_ranges,
    _hex_dict_ranges: this._hex_dict_ranges,
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

  protected _normalizeDictionary = (dictionary: string[] | ShortUniqueIdDefaultDictionaries, shuffle?: boolean): string[] => {
    let finalDict: string[];

    if (dictionary && Array.isArray(dictionary) && dictionary.length > 1) {
      finalDict = dictionary as string[];
    } else {
      finalDict = [];

      let i;

      this.dictIndex = i = 0;

      const rangesName = `_${dictionary as ShortUniqueIdDefaultDictionaries}_dict_ranges`;
      const ranges = this._dict_ranges[rangesName];

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

    return finalDict;
  }

  /** Change the dictionary after initialization. */
  setDictionary = (dictionary: string[] | ShortUniqueIdDefaultDictionaries, shuffle?: boolean): void => {
    this.dict = this._normalizeDictionary(dictionary, shuffle);

    // Cache Dictionary Length for future usage.
    this.dictLength = this.dict.length;

    // Reset internal counter.
    this.setCounter(0);
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

  rnd = (uuidLength: number = this.uuidLength || DEFAULT_UUID_LENGTH): string => {
    return this.randomUUID(uuidLength);
  };

  /**
   * Generates UUID by creating each part randomly.
   * @alias `const uid = new ShortUniqueId(); uid.rnd(uuidLength: number);`
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

  fmt = (format: string, date?: Date): string => {
    return this.formattedUUID(format, date);
  };

  /**
   * Generates custom UUID with the provided format string.
   * @alias `const uid = new ShortUniqueId(); uid.fmt(format: string);`
   */
  formattedUUID = (format: string, date?: Date): string => {
    const fnMap = {
      '$r': this.randomUUID,
      '$s': this.sequentialUUID,
      '$t': this.stamp,
    };

    const result = format.replace(
      /\$[rs]\d{0,}|\$t0|\$t[1-9]\d{1,}/g,
      (m) => {
        const fn = m.slice(0, 2);
        const len = parseInt(m.slice(2), 10);

        if (fn === '$s') {
          return fnMap[fn]().padStart(len, '0');
        }

        if (fn === '$t' && date) {
          return fnMap[fn](len, date);
        }

        return fnMap[fn as keyof typeof fnMap](len);
      },
    );

    return result;
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
   * <div style="background: white; padding: 5px; border-radius: 5px; overflow: hidden;">
   *  <img src="https://render.githubusercontent.com/render/math?math=%5CHuge%20H=n%5El"/>
   * </div>
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
   * <div style="background: white; padding: 5px; border-radius: 5px; overflow: hidden;">
   *  <img src="https://render.githubusercontent.com/render/math?math=%5CHuge%20Q(H)%5Capprox%5Csqrt%7B%5Cfrac%7B%5Cpi%7D%7B2%7DH%7D"/>
   * </div>
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
   * <div style="background: white; padding: 5px; border-radius: 5px; overflow: hidden;">
   *  <img src="https://render.githubusercontent.com/render/math?math=%5CHuge%20p(r%3B%20H)%5Capprox%5Cfrac%7B%5Csqrt%7B%5Cfrac%7B%5Cpi%7D%7B2%7Dr%7D%7D%7BH%7D"/>
   * </div>
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
   * <div style="background: white; padding: 5px; border-radius: 5px; overflow: hidden;">
   *  <img src="https://render.githubusercontent.com/render/math?math=%5CHuge%201-%5Cfrac%7BQ(H)%7D%7BH%7D"/>
   * </div>
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
  stamp = (finalLength: number, date?: Date): string => {
    const hexStamp = Math.floor(+(date || new Date()) / 1000).toString(16);

    if (typeof finalLength === 'number' && finalLength === 0) {
      return hexStamp;
    }

    if (typeof finalLength !== 'number' || finalLength < 10) {
      throw new Error(
        [
          'Param finalLength must be a number greater than or equal to 10,',
          'or 0 if you want the raw hexadecimal timestamp',
        ].join('\n')
      );
    }

    const idLength = finalLength - 9;

    const rndIdx = Math.round(Math.random() * ((idLength > 15) ? 15 : idLength));

    const id = this.randomUUID(idLength);

    return `${id.substring(0, rndIdx)}${hexStamp}${id.substring(rndIdx)}${rndIdx.toString(16)}`;
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
  parseStamp = (suid: string, format?: string): Date => {
    if (format && !(/t0|t[1-9]\d{1,}/).test(format)) {
      throw new Error('Cannot extract date from a formated UUID with no timestamp in the format');
    }

    const stamp = (
      format
    ) ? (
      format.replace(
        /\$[rs]\d{0,}|\$t0|\$t[1-9]\d{1,}/g,
        (m) => {
          const fnMap = {
            '$r': (len: number) => [...Array(len)].map(() => 'r').join(''),
            '$s': (len: number) => [...Array(len)].map(() => 's').join(''),
            '$t': (len: number) => [...Array(len)].map(() => 't').join(''),
          };

          const fn = m.slice(0, 2);
          const len = parseInt(m.slice(2), 10);

          return fnMap[fn as keyof typeof fnMap](len);
        },
      ).replace(
        /^(.*?)(t{8,})(.*)$/g,
        (_m, p1, p2) => {
          return suid.substring(p1.length, p1.length + p2.length);
        },
      )
    ) : (
      suid
    );

    if (stamp.length === 8) {
      return new Date(parseInt(stamp, 16) * 1000);
    }

    if (stamp.length < 10) {
      throw new Error('Stamp length invalid');
    }

    const rndIdx = parseInt(stamp.substring(stamp.length - 1), 16);

    return new Date(parseInt(stamp.substring(rndIdx, rndIdx + 8), 16) * 1000);
  };

  /**
   * Set the counter to a specific value.
   */
  setCounter = (counter: number): void => {
    this.counter = counter;
  };

  /**
   * Validate given UID contains only characters from the instanced dictionary or optionally provided dictionary.
   */
  validate = (uid: string, dictionary?: string[] | ShortUniqueIdDefaultDictionaries): boolean => {
    const finalDictionary = dictionary ? this._normalizeDictionary(dictionary) : this.dict;

    return uid.split('').every((c) => finalDictionary.includes(c));
  };

  constructor(argOptions: Partial<ShortUniqueIdOptions> = {}) {
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
      counter,
    } = options;

    this.uuidLength = length;

    this.setDictionary(dictionary, shuffle);
    this.setCounter(counter);

    this.debug = options.debug;
    this.log(this.dict);
    this.log(
      `Generator instantiated with Dictionary Size ${this.dictLength} and counter set to ${this.counter}`
    );

    this.log = this.log.bind(this);
    this.setDictionary = this.setDictionary.bind(this);
    this.setCounter = this.setCounter.bind(this);
    this.seq = this.seq.bind(this);
    this.sequentialUUID = this.sequentialUUID.bind(this);
    this.rnd = this.rnd.bind(this);
    this.randomUUID = this.randomUUID.bind(this);
    this.fmt = this.fmt.bind(this);
    this.formattedUUID = this.formattedUUID.bind(this);
    this.availableUUIDs = this.availableUUIDs.bind(this);
    this.approxMaxBeforeCollision = this.approxMaxBeforeCollision.bind(this);
    this.collisionProbability = this.collisionProbability.bind(this);
    this.uniqueness = this.uniqueness.bind(this);
    this.getVersion = this.getVersion.bind(this);
    this.stamp = this.stamp.bind(this);
    this.parseStamp = this.parseStamp.bind(this);

    return this;
  }
}
