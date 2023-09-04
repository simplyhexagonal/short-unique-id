/**
 * @packageDocumentation
 **/
export interface ShortUniqueIdRanges {
    [k: string]: [number, number];
}
export interface ShortUniqueIdRangesMap {
    [k: string]: ShortUniqueIdRanges;
}
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
}
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
export declare const DEFAULT_UUID_LENGTH: number;
export declare const DEFAULT_OPTIONS: ShortUniqueIdOptions;
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
    static default: typeof ShortUniqueId;
    counter: number;
    debug: boolean;
    dict: string[];
    version: string;
    dictIndex: number;
    dictRange: number[];
    lowerBound: number;
    upperBound: number;
    dictLength: number;
    uuidLength: number;
    protected _digit_first_ascii: number;
    protected _digit_last_ascii: number;
    protected _alpha_lower_first_ascii: number;
    protected _alpha_lower_last_ascii: number;
    protected _hex_last_ascii: number;
    protected _alpha_upper_first_ascii: number;
    protected _alpha_upper_last_ascii: number;
    protected _number_dict_ranges: ShortUniqueIdRanges;
    protected _alpha_dict_ranges: ShortUniqueIdRanges;
    protected _alpha_lower_dict_ranges: ShortUniqueIdRanges;
    protected _alpha_upper_dict_ranges: ShortUniqueIdRanges;
    protected _alphanum_dict_ranges: ShortUniqueIdRanges;
    protected _alphanum_lower_dict_ranges: ShortUniqueIdRanges;
    protected _alphanum_upper_dict_ranges: ShortUniqueIdRanges;
    protected _hex_dict_ranges: ShortUniqueIdRanges;
    protected _dict_ranges: ShortUniqueIdRangesMap;
    protected log: (...args: any[]) => void;
    /** Change the dictionary after initialization. */
    setDictionary: (dictionary: string[] | ShortUniqueIdDefaultDictionaries, shuffle?: boolean) => void;
    seq: () => string;
    /**
     * Generates UUID based on internal counter that's incremented after each ID generation.
     * @alias `const uid = new ShortUniqueId(); uid.seq();`
     */
    sequentialUUID: () => string;
    rnd: (uuidLength?: number) => string;
    /**
     * Generates UUID by creating each part randomly.
     * @alias `const uid = new ShortUniqueId(); uid.rnd(uuidLength: number);`
     */
    randomUUID: (uuidLength?: number) => string;
    fmt: (format: string, date?: Date) => string;
    /**
     * Generates custom UUID with the provided format string.
     * @alias `const uid = new ShortUniqueId(); uid.fmt(format: string);`
     */
    formattedUUID: (format: string, date?: Date) => string;
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
    availableUUIDs: (uuidLength?: number) => number;
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
    approxMaxBeforeCollision: (rounds?: number) => number;
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
    collisionProbability: (rounds?: number, uuidLength?: number) => number;
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
    uniqueness: (rounds?: number) => number;
    /**
     * Return the version of this module.
     */
    getVersion: () => string;
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
    stamp: (finalLength: number, date?: Date) => string;
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
    parseStamp: (suid: string, format?: string) => Date;
    /**
     * Set the counter to a specific value.
     */
    setCounter: (counter: number) => void;
    constructor(argOptions?: Partial<ShortUniqueIdOptions>);
}
