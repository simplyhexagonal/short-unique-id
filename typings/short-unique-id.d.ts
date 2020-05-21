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
declare type Options = {
    /** User-defined character dictionary */
    dictionary: string[];
    /** If true, sequentialUUID use the dictionary in the given order */
    shuffle: boolean;
    /** If true the instance will console.log useful info */
    debug: boolean;
    /** From 1 to infinity, the length you wish your UUID to be */
    length: number;
};
/**
 * Generate random or sequential UUID of any length.
 *
 * ### Use as module
 *
 * ```js
 * // Deno (web module) Import
 * import ShortUniqueId from 'https://cdn.jsdelivr.net/npm/short-unique-id@latest/short_uuid/mod.ts';
 *
 * // ES6 / TypeScript Import
 * import ShortUniqueId from 'short-unique-id';
 *
 * //or Node.js require
 * const {default: ShortUniqueId} = require('short-unique-id');
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
 * For more information take a look at the [Options type definition](/globals.html#options).
 */
declare class ShortUniqueId extends Function {
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
    protected log(...args: any[]): void;
    constructor(argOptions?: Partial<Options>);
    /** Change the dictionary after initialization. */
    setDictionary(dictionary: string[]): void;
    seq(): string;
    /**
     * Generates UUID based on internal counter that's incremented after each ID generation.
     * @alias `const uid = new ShortUniqueId(); uid.seq();`
     */
    sequentialUUID(): string;
    /**
     * Generates UUID by creating each part randomly.
     * @alias `const uid = new ShortUniqueId(); uid(uuidLength: number);`
     */
    randomUUID(uuidLength?: number): string;
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
    availableUUIDs(uuidLength?: number): number;
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
    approxMaxBeforeCollision(rounds?: number): number;
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
    collisionProbability(rounds?: number, uuidLength?: number): number;
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
    uniqueness(rounds?: number): number;
    /**
     * Return the version of this module.
     */
    getVersion(): string;
}
export default ShortUniqueId;
