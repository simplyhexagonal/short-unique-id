const { version } = require('../package.json');

const DEFAULT_RANDOM_ID_LEN = 6;

const DICT_RANGES = {
  digits: [48, 58],
  lowerCase: [97, 123],
  upperCase: [65, 91],
};

class ShortUniqueId {
  /* eslint-disable consistent-return */
  log(...args) {
    const finalArgs = [...args];
    finalArgs[0] = `[short-unique-id] ${args[0]}`;
    /* eslint-disable no-console */
    if (this.debug === true) {
      if (typeof console !== 'undefined' && console !== null) {
        return console.log(...finalArgs);
      }
    }
    /* eslint-enable no-console */
  }
  /* eslint-enable consistent-return */

  constructor(options = {}) {
    this.counter = 0;
    this.debug = false;
    this.dict = [];
    this.version = version;

    const {
      dictionary: userDict,
      skipShuffle,
    } = options;

    if (userDict) {
      this.dict = userDict;
    } else {
      let i;
      /* eslint-disable no-multi-assign */
      this.dictIndex = i = 0;
      Object.keys(DICT_RANGES).forEach((rangeType) => {
        this.dictRange = DICT_RANGES[rangeType];
        /* eslint-disable prefer-destructuring */
        this.lowerBound = this.dictRange[0];
        this.upperBound = this.dictRange[1];
        /* eslint-enable prefer-destructuring */
        for (
          this.dictIndex = i = this.lowerBound;
          this.lowerBound <= this.upperBound ? i < this.upperBound : i > this.upperBound;
          this.dictIndex = this.lowerBound <= this.upperBound ? i += 1 : i -= 1
        ) {
          this.dict.push(String.fromCharCode(this.dictIndex));
        }
      });
      /* eslint-enable no-multi-assign */
    }

    if (!skipShuffle) {
      // Shuffle Dictionary for removing selection bias.
      this.dict = this.dict.sort(() => Math.random() - 0.5);
    }

    // Cache Dictionary Length for future usage.
    this.dictLength = this.dict.length;// Resets internal counter.
    this.counter = 0;
    this.debug = options.debug;
    this.log(this.dict);
    this.log((`Generator instantiated with Dictionary Size ${this.dictLength}`));
  }

  getDict() {
    return this.dict;
  }

  /**
  * Generates UUID based on internal counter that's incremented after each ID generation.
  */
  sequentialUUID() {
    let counterDiv;
    let counterRem;
    let id;
    id = '';
    counterDiv = this.counter;
    /* eslint-disable no-constant-condition */
    while (true) {
      counterRem = counterDiv % this.dictLength;
      counterDiv = parseInt(counterDiv / this.dictLength, 10);
      id += this.dict[counterRem];
      if (counterDiv === 0) {
        break;
      }
    }
    /* eslint-enable no-constant-condition */
    this.counter += 1;
    return id;
  }

  /**
    * Generates UUID by creating each part randomly.
    * @param {Integer} uuidLength Desired UUID length.
    */
  randomUUID(uuidLength = DEFAULT_RANDOM_ID_LEN) {
    let id;
    let randomPartIdx;
    let j;

    /* eslint-disable no-unused-vars */
    let idIndex;
    /* eslint-enable no-unused-vars */

    if ((uuidLength === null || typeof uuidLength === 'undefined') || uuidLength < 1) {
      throw new Error('Invalid UUID Length Provided');
    }

    // Generate random ID parts from Dictionary.
    id = '';
    /* eslint-disable */
    for (
      idIndex = j = 0;
      0 <= uuidLength ? j < uuidLength : j > uuidLength;
      idIndex = 0 <= uuidLength ? j += 1: j -= 1
    ) {
      randomPartIdx = parseInt(Math.random() * this.dictLength) % this.dictLength;
      id += this.dict[randomPartIdx];
    }
    /* eslint-enable */

    // Return random generated ID.
    return id;
  }

  getVersion() {
    return this.version;
  }
}

export default ShortUniqueId;
