((() => {
  /**
    * Short Unique Id Generator.
    */
  const _ShortUniqueId = function _ShortUniqueId(options) {
    const self = this;

    this.DEFAULT_RANDOM_ID_LEN;
    this.DICT_RANGES;
    this.dict;
    this.dictIndex;
    this.dictLength;
    this.dictRange;
    this.lowerBound;
    this.rangeType;
    this.upperBound;
    this._i;

    // This provides collision-space of ~57B.
    this.DEFAULT_RANDOM_ID_LEN = 6;

    // ID Generator Dictionary.
    // currently uses only alphabets and digits.
    this.DICT_RANGES = {
      digits: [48, 58],
      lowerCase: [97, 123],
      upperCase: [65, 91]
    };

    // Generate Dictionary.
    this.dict = [];

    /**
      * Check if environment has `console`, if so pass arguments along to its `log` function.
      * Logging is optionally enabled by passing `debug=true` during instantiation.
      */
    this.log = function log() {
      let _ref;
      arguments[0] = `[frugal-id] ${arguments[0]}`;
      if (this.debug === true) {
        return typeof console !== "undefined" && console !== null ? (_ref = console.log) != null ? _ref.apply(console, arguments) : void 0 : void 0;
      }
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
      const self = this;

      let counterDiv;
      let counterRem;
      let id;
      id = '';
      counterDiv = this.counter;
      while (true) {
        counterRem = counterDiv % self.dictLength;
        counterDiv = parseInt(counterDiv / self.dictLength);
        id += self.dict[counterRem];
        if (counterDiv === 0) {
          break;
        }
      }
      this.counter++;
      return id;
    };

    /**
      * Generates UUID by creating each part randomly.
      * @param {Integer} uuidLength Desired UUID length.
      */
    this.randomUUID = function randomUUID (uuidLength) {
      const self = this;

      let id;
      let idIndex;
      let randomPartIdx;
      let _j;
      if (uuidLength == null) {
        uuidLength = this.DEFAULT_RANDOM_ID_LEN;
      }
      if ((uuidLength == null) || uuidLength < 1) {
        throw new Error("Invalid UUID Length Provided");
      }

      // Generate random ID parts from Dictionary.
      id = '';
      for (idIndex = _j = 0; 0 <= uuidLength ? _j < uuidLength : _j > uuidLength; idIndex = 0 <= uuidLength ? ++_j : --_j) {
        randomPartIdx = parseInt(Math.random() * self.dictLength) % self.dictLength;
        id += self.dict[randomPartIdx];
      }

      // Return random generated ID.
      return id;
    };

    for (this.rangeType in self.DICT_RANGES) {
      self.dictRange = self.DICT_RANGES[self.rangeType];
      self.lowerBound = self.dictRange[0], self.upperBound = self.dictRange[1];
      for (this.dictIndex = this._i = this.lowerBound; this.lowerBound <= this.upperBound ? this._i < this.upperBound : this._i > this.upperBound; this.dictIndex = this.lowerBound <= this.upperBound ? ++this._i : --this._i) {
        self.dict.push(String.fromCharCode(self.dictIndex));
      }
    }

    // Shuffle Dictionary for removing selection bias.
    this.dict = this.dict.sort((a, b) => Math.random() <= 0.5);

    //Cache Dictionary Length for future usage.
    this.dictLength = this.dict.length;

    // Resets internal counter.
    if (options == null) {
      options = {};
    }
    this.counter = 0;
    this.debug = options.debug;
    this.log((`Generator created with Dictionary Size ${this.dictLength}`));
  };

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined'){
    module.exports = _ShortUniqueId;
  }else if(typeof define === 'function' && define.amd){
    define([], () => _ShortUniqueId);
  }else{
    window.ShortUniqueId = _ShortUniqueId;
  }
}))();
