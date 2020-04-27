// Copyright 2017-2020 the Short Unique ID authors. All rights reserved. Apache license.
// @deno-types="./mod.d.ts"
import { version } from './version.json';

const DEFAULT_ID_LENGTH: number = 6;

const DIGIT_FIRST_ASCII: number = 48;
const DIGIT_LAST_ASCII: number = 58;
const ALPHA_LOWER_FIRST_ASCII: number = 97;
const ALPHA_LOWER_LAST_ASCII: number = 123;
const ALPHA_UPPER_FIRST_ASCII: number = 65;
const ALPHA_UPPER_LAST_ASCII: number = 91;

const DICT_RANGES: Ranges = {
  digits: [DIGIT_FIRST_ASCII, DIGIT_LAST_ASCII],
  lowerCase: [ALPHA_LOWER_FIRST_ASCII, ALPHA_LOWER_LAST_ASCII],
  upperCase: [ALPHA_UPPER_FIRST_ASCII, ALPHA_UPPER_LAST_ASCII],
};

const DEFAULT_OPTIONS: Options = {
  dictionary: [],
  skipShuffle: false,
  debug: false,
  length: DEFAULT_ID_LENGTH,
};

class ShortUniqueId extends Function {
  counter: number;

  debug: boolean;

  dict: string[];

  version: string;

  dictIndex: number = 0;

  dictRange: number[] =[];

  lowerBound: number = 0;

  upperBound: number = 0;

  dictLength: number = 0;

  uuidLength: number;

  /* tslint:disable consistent-return */
  log(...args: any[]) {
    const finalArgs = [...args];
    finalArgs[0] = `[short-unique-id] ${args[0]}`;
    /* tslint:disable no-console */
    if (this.debug === true) {
      if (typeof console !== 'undefined' && console !== null) {
        return console.log(...finalArgs);
      }
    }
    /* tslint:enable no-console */
  }
  /* tslint:enable consistent-return */

  constructor(argOptions: Partial<Options> = {}) {
    super('...args', 'return this.randomUUID(...args)');

    const options: Options = {
      ...DEFAULT_OPTIONS,
      ...argOptions as Partial<Options>,
    };

    this.counter = 0;
    this.debug = false;
    this.dict = [];
    this.version = version;

    const {
      dictionary: userDict,
      skipShuffle,
      length,
    } = options;

    this.uuidLength = length;

    if (userDict && userDict.length > 1) {
      this.setDictionary(userDict);
    } else {
      let i;

      this.dictIndex = i = 0;

      Object.keys(DICT_RANGES).forEach((rangeType: any) => {
        const rangeTypeKey : keyof Ranges = rangeType as keyof Ranges;

        this.dictRange = DICT_RANGES[rangeTypeKey];

        this.lowerBound = this.dictRange[0];
        this.upperBound = this.dictRange[1];

        for (
          this.dictIndex = i = this.lowerBound;
          this.lowerBound <= this.upperBound ? i < this.upperBound : i > this.upperBound;
          this.dictIndex = this.lowerBound <= this.upperBound ? i += 1 : i -= 1
        ) {
          this.dict.push(String.fromCharCode(this.dictIndex));
        }
      });
    }

    if (!skipShuffle) {
      // Shuffle Dictionary for removing selection bias.
      const PROBABILITY = 0.5;
      this.setDictionary(this.dict.sort(() => Math.random() - PROBABILITY));
    } else {
      this.setDictionary(this.dict);
    }

    this.debug = options.debug;
    this.log(this.dict);
    this.log((`Generator instantiated with Dictionary Size ${this.dictLength}`));

    const instance = this.bind(this);
    Object.getOwnPropertyNames(this).forEach((prop: string) => {
      if (
        !(
          /arguments|caller|callee|length|name|prototype/
        ).test(prop)
      ) {
        const propKey = prop as keyof ShortUniqueId;
        instance[prop] = this[propKey];
      }
    });

    return instance;
  }

  setDictionary(dictionary: string[]) {
    this.dict = dictionary;

    // Cache Dictionary Length for future usage.
    this.dictLength = this.dict.length;// Resets internal counter.
    this.counter = 0;
  }

  /* Generates UUID based on internal counter that's incremented after each ID generation. */
  sequentialUUID() {
    let counterDiv: number;
    let counterRem: number;
    let id: string = '';

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

  /*  Generates UUID by creating each part randomly. */
  randomUUID(uuidLength: number = this.uuidLength) {
    let id;
    let randomPartIdx;
    let j;
    let idIndex;

    if ((uuidLength === null || typeof uuidLength === 'undefined') || uuidLength < 1) {
      throw new Error('Invalid UUID Length Provided');
    }

    // Generate random ID parts from Dictionary.
    id = '';
    for (
      idIndex = j = 0;
      0 <= uuidLength ? j < uuidLength : j > uuidLength;
      idIndex = 0 <= uuidLength ? j += 1: j -= 1
    ) {
      randomPartIdx = Math.trunc(Math.random() * this.dictLength) % this.dictLength;
      id += this.dict[randomPartIdx];
    }

    // Return random generated ID.
    return id;
  }

  /* Calculates total number of possible UUIDs */
  availableUUIDs() {
    return;
  }

  getVersion() {
    return this.version;
  }
}

export default ShortUniqueId;
