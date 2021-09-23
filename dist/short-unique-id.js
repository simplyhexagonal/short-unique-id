var ShortUniqueId = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
  var __export = (target, all) => {
    __markAsModule(target);
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // src/index.ts
  var src_exports = {};
  __export(src_exports, {
    DEFAULT_UUID_LENGTH: () => DEFAULT_UUID_LENGTH,
    default: () => ShortUniqueId
  });

  // package.json
  var version = "4.4.4";

  // src/index.ts
  var DEFAULT_UUID_LENGTH = 6;
  var DEFAULT_OPTIONS = {
    dictionary: "alphanum",
    shuffle: true,
    debug: false,
    length: DEFAULT_UUID_LENGTH
  };
  var _ShortUniqueId = class extends Function {
    constructor(argOptions = {}) {
      super();
      this.dictIndex = 0;
      this.dictRange = [];
      this.lowerBound = 0;
      this.upperBound = 0;
      this.dictLength = 0;
      this._digit_first_ascii = 48;
      this._digit_last_ascii = 58;
      this._alpha_lower_first_ascii = 97;
      this._alpha_lower_last_ascii = 123;
      this._hex_last_ascii = 103;
      this._alpha_upper_first_ascii = 65;
      this._alpha_upper_last_ascii = 91;
      this._number_dict_ranges = {
        digits: [this._digit_first_ascii, this._digit_last_ascii]
      };
      this._alpha_dict_ranges = {
        lowerCase: [this._alpha_lower_first_ascii, this._alpha_lower_last_ascii],
        upperCase: [this._alpha_upper_first_ascii, this._alpha_upper_last_ascii]
      };
      this._alpha_lower_dict_ranges = {
        lowerCase: [this._alpha_lower_first_ascii, this._alpha_lower_last_ascii]
      };
      this._alpha_upper_dict_ranges = {
        upperCase: [this._alpha_upper_first_ascii, this._alpha_upper_last_ascii]
      };
      this._alphanum_dict_ranges = {
        digits: [this._digit_first_ascii, this._digit_last_ascii],
        lowerCase: [this._alpha_lower_first_ascii, this._alpha_lower_last_ascii],
        upperCase: [this._alpha_upper_first_ascii, this._alpha_upper_last_ascii]
      };
      this._alphanum_lower_dict_ranges = {
        digits: [this._digit_first_ascii, this._digit_last_ascii],
        lowerCase: [this._alpha_lower_first_ascii, this._alpha_lower_last_ascii]
      };
      this._alphanum_upper_dict_ranges = {
        digits: [this._digit_first_ascii, this._digit_last_ascii],
        upperCase: [this._alpha_upper_first_ascii, this._alpha_upper_last_ascii]
      };
      this._hex_dict_ranges = {
        decDigits: [this._digit_first_ascii, this._digit_last_ascii],
        alphaDigits: [this._alpha_lower_first_ascii, this._hex_last_ascii]
      };
      this.log = (...args) => {
        const finalArgs = [...args];
        finalArgs[0] = `[short-unique-id] ${args[0]}`;
        if (this.debug === true) {
          if (typeof console !== "undefined" && console !== null) {
            return console.log(...finalArgs);
          }
        }
      };
      this.setDictionary = (dictionary, shuffle) => {
        let finalDict;
        if (dictionary && Array.isArray(dictionary) && dictionary.length > 1) {
          finalDict = dictionary;
        } else {
          finalDict = [];
          let i;
          this.dictIndex = i = 0;
          const rangesName = `_${dictionary}_dict_ranges`;
          const ranges = this[rangesName];
          Object.keys(ranges).forEach((rangeType) => {
            const rangeTypeKey = rangeType;
            this.dictRange = ranges[rangeTypeKey];
            this.lowerBound = this.dictRange[0];
            this.upperBound = this.dictRange[1];
            for (this.dictIndex = i = this.lowerBound; this.lowerBound <= this.upperBound ? i < this.upperBound : i > this.upperBound; this.dictIndex = this.lowerBound <= this.upperBound ? i += 1 : i -= 1) {
              finalDict.push(String.fromCharCode(this.dictIndex));
            }
          });
        }
        if (shuffle) {
          const PROBABILITY = 0.5;
          finalDict = finalDict.sort(() => Math.random() - PROBABILITY);
        }
        this.dict = finalDict;
        this.dictLength = this.dict.length;
        this.counter = 0;
      };
      this.seq = () => {
        return this.sequentialUUID();
      };
      this.sequentialUUID = () => {
        let counterDiv;
        let counterRem;
        let id = "";
        counterDiv = this.counter;
        do {
          counterRem = counterDiv % this.dictLength;
          counterDiv = Math.trunc(counterDiv / this.dictLength);
          id += this.dict[counterRem];
        } while (counterDiv !== 0);
        this.counter += 1;
        return id;
      };
      this.randomUUID = (uuidLength = this.uuidLength || DEFAULT_UUID_LENGTH) => {
        let id;
        let randomPartIdx;
        let j;
        if (uuidLength === null || typeof uuidLength === "undefined" || uuidLength < 1) {
          throw new Error("Invalid UUID Length Provided");
        }
        const isPositive = uuidLength >= 0;
        id = "";
        for (j = 0; j < uuidLength; j += 1) {
          randomPartIdx = parseInt((Math.random() * this.dictLength).toFixed(0), 10) % this.dictLength;
          id += this.dict[randomPartIdx];
        }
        return id;
      };
      this.availableUUIDs = (uuidLength = this.uuidLength) => {
        return parseFloat(Math.pow([...new Set(this.dict)].length, uuidLength).toFixed(0));
      };
      this.approxMaxBeforeCollision = (rounds = this.availableUUIDs(this.uuidLength)) => {
        return parseFloat(Math.sqrt(Math.PI / 2 * rounds).toFixed(20));
      };
      this.collisionProbability = (rounds = this.availableUUIDs(this.uuidLength), uuidLength = this.uuidLength) => {
        return parseFloat((this.approxMaxBeforeCollision(rounds) / this.availableUUIDs(uuidLength)).toFixed(20));
      };
      this.uniqueness = (rounds = this.availableUUIDs(this.uuidLength)) => {
        const score = parseFloat((1 - this.approxMaxBeforeCollision(rounds) / rounds).toFixed(20));
        return score > 1 ? 1 : score < 0 ? 0 : score;
      };
      this.getVersion = () => {
        return this.version;
      };
      this.stamp = (finalLength) => {
        if (typeof finalLength !== "number" || finalLength < 10) {
          throw new Error("Param finalLength must be number greater than 10");
        }
        const hexStamp = Math.floor(+new Date() / 1e3).toString(16);
        const idLength = finalLength - 9;
        const rndIdx = Math.round(Math.random() * (idLength > 15 ? 15 : idLength));
        const id = this.randomUUID(idLength);
        return `${id.substr(0, rndIdx)}${hexStamp}${id.substr(rndIdx)}${rndIdx.toString(16)}`;
      };
      this.parseStamp = (stamp) => {
        if (stamp.length < 10) {
          throw new Error("Stamp length invalid");
        }
        const rndIdx = parseInt(stamp.substr(stamp.length - 1, 1), 16);
        return new Date(parseInt(stamp.substr(rndIdx, 8), 16) * 1e3);
      };
      const options = __spreadValues(__spreadValues({}, DEFAULT_OPTIONS), argOptions);
      this.counter = 0;
      this.debug = false;
      this.dict = [];
      this.version = version;
      const {
        dictionary,
        shuffle,
        length
      } = options;
      this.uuidLength = length;
      this.setDictionary(dictionary, shuffle);
      this.debug = options.debug;
      this.log(this.dict);
      this.log(`Generator instantiated with Dictionary Size ${this.dictLength}`);
      return new Proxy(this, {
        apply: (target, that, args) => this.randomUUID(...args)
      });
    }
  };
  var ShortUniqueId = _ShortUniqueId;
  ShortUniqueId.default = _ShortUniqueId;
  return src_exports;
})();
//# sourceMappingURL=short-unique-id.js.map
'undefined'!=typeof module&&(module.exports=ShortUniqueId.default),'undefined'!=typeof window&&(ShortUniqueId=ShortUniqueId.default);