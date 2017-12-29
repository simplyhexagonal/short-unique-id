((() => {
  /**
    * Short Unique Id Generator.
    * @param {{debug: Boolean}} options Options object.
    */
  const _ShortUniqueId = function _ShortUniqueId(options) {
    const self = this;

    // This provides collision-space of ~57B.
    this.DEFAULT_RANDOM_ID_LEN = 6;

    // ID Generator Dictionary.
    // currently uses only alphabets and digits.
    this.DICT_RANGES = {
      digits: [48, 58],
      lowerCase: [97, 123],
      upperCase: [65, 91],
    };

    // Generate Dictionary.
    this.dict = [];

    /**
      * Check if environment has `console`, if so pass arguments along to its `log` function.
      * Logging is optionally enabled by passing `debug=true` during instantiation.
      * @param {Object} args Any list of objects.
      */
    this.log = function log(...args) {
      args[0] = `[short-unique-id] ${args[0]}`;
      /* eslint-disable no-console */
      if (this.debug === true) {
        if (typeof console !== 'undefined' && console !== null) {
          return console.log(...args);
        }
      }
      /* eslint-enable no-console */
      return undefined;
    };

    /**
      * Returns generator's internal dictionary.
      */
    this.getDict = function getDict() {
      return this.dict;
    };

    /**
      * Generates UUID based on internal counter that's incremented after each ID generation.
      */
    this.sequentialUUID = function sequentialUUID() {
      let counterDiv;
      let counterRem;
      let id;
      id = '';
      counterDiv = this.counter;
      /* eslint-disable no-constant-condition */
      while (true) {
        counterRem = counterDiv % self.dictLength;
        counterDiv = parseInt(counterDiv / self.dictLength, 10);
        id += self.dict[counterRem];
        if (counterDiv === 0) {
          break;
        }
      }
      /* eslint-enable no-constant-condition */
      this.counter += 1;
      return id;
    };

    /**
      * Generates UUID by creating each part randomly.
      * @param {Integer} uuidLength Desired UUID length.
      */
    this.randomUUID = function randomUUID(uuidLength) {
      let id;
      let randomPartIdx;
      let _j;
      if (uuidLength === null || typeof uuidLength === 'undefined') {
        uuidLength = this.DEFAULT_RANDOM_ID_LEN;
      }
      if ((uuidLength === null || typeof uuidLength === 'undefined') || uuidLength < 1) {
        throw new Error('Invalid UUID Length Provided');
      }

      // Generate random ID parts from Dictionary.
      /* eslint-disable */
      let idIndex;
      id = '';
      for (idIndex = _j = 0; 0 <= uuidLength ? _j < uuidLength : _j > uuidLength; idIndex = 0 <= uuidLength ? ++_j : --_j) {
        randomPartIdx = parseInt(Math.random() * self.dictLength) % self.dictLength;
        id += self.dict[randomPartIdx];
      }
      /* eslint-enable */

      // Return random generated ID.
      return id;
    };

    /* eslint-disable */
    this.dictIndex = this._i = 0;
    let rangeType;
    for (rangeType in self.DICT_RANGES) {
      self.dictRange = self.DICT_RANGES[rangeType];
      self.lowerBound = self.dictRange[0], self.upperBound = self.dictRange[1];
      for (this.dictIndex = this._i = this.lowerBound; this.lowerBound <= this.upperBound ? this._i < this.upperBound : this._i > this.upperBound; this.dictIndex = this.lowerBound <= this.upperBound ? ++this._i : --this._i) {
        self.dict.push(String.fromCharCode(self.dictIndex));
      }
    }
    /* eslint-enable */

    // Shuffle Dictionary for removing selection bias.
    this.dict = this.dict.sort(() => Math.random() <= 0.5);

    // Cache Dictionary Length for future usage.
    this.dictLength = this.dict.length;

    // Resets internal counter.
    if (options === null || typeof options === 'undefined') {
      options = {};
    }
    this.counter = 0;
    this.debug = options.debug;
    this.log((`Generator created with Dictionary Size ${this.dictLength}`));
  };

  /* eslint-disable no-undef */
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = _ShortUniqueId;
  } else if (typeof define === 'function' && define.amd) {
    define([], () => _ShortUniqueId);
  } else {
    window.ShortUniqueId = _ShortUniqueId;
  }
  /* eslint-enable no-undef */
}))();
