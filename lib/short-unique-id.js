"use strict";Object.defineProperty(exports, "__esModule", {value: true});// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

// This is a specialised implementation of a System module loader.

"use strict";

// @ts-nocheck
/* eslint-disable */
let System, __instantiate;
(() => {
  const r = new Map();

  System = {
    register(id, d, f) {
      r.set(id, { d, f, exp: {} });
    },
  };
  async function dI(mid, src) {
    let id = mid.replace(/\.\w+$/i, "");
    if (id.includes("./")) {
      const [o, ...ia] = id.split("/").reverse(),
        [, ...sa] = src.split("/").reverse(),
        oa = [o];
      let s = 0,
        i;
      while ((i = ia.shift())) {
        if (i === "..") s++;
        else if (i === ".") break;
        else oa.push(i);
      }
      if (s < sa.length) oa.push(...sa.slice(s));
      id = oa.reverse().join("/");
    }
    return r.has(id) ? gExpA(id) : Promise.resolve().then(() => require(mid));
  }

  function gC(id, main) {
    return {
      id,
      import: (m) => dI(m, id),
      meta: { url: id, main },
    };
  }

  function gE(exp) {
    return (id, v) => {
      v = typeof id === "string" ? { [id]: v } : id;
      for (const [id, value] of Object.entries(v)) {
        Object.defineProperty(exp, id, {
          value,
          writable: true,
          enumerable: true,
        });
      }
    };
  }

  function rF(main) {
    for (const [id, m] of r.entries()) {
      const { f, exp } = m;
      const { execute: e, setters: s } = f(gE(exp), gC(id, id === main));
      delete m.f;
      m.e = e;
      m.s = s;
    }
  }

  async function gExpA(id) {
    if (!r.has(id)) return;
    const m = r.get(id);
    if (m.s) {
      const { d, e, s } = m;
      delete m.s;
      delete m.e;
      for (let i = 0; i < s.length; i++) s[i](await gExpA(d[i]));
      const r = e();
      if (r) await r;
    }
    return m.exp;
  }

  function gExp(id) {
    if (!r.has(id)) return;
    const m = r.get(id);
    if (m.s) {
      const { d, e, s } = m;
      delete m.s;
      delete m.e;
      for (let i = 0; i < s.length; i++) s[i](gExp(d[i]));
      e();
    }
    return m.exp;
  }
  __instantiate = (m, a) => {
    System = __instantiate = undefined;
    rF(m);
    return a ? gExpA(m) : gExp(m);
  };
})();

System.register("version", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            exports_1("default", '3.2.3');
        }
    };
});
System.register("mod", ["version"], function (exports_2, context_2) {
    "use strict";
    var version_ts_1, DEFAULT_UUID_LENGTH, DIGIT_FIRST_ASCII, DIGIT_LAST_ASCII, ALPHA_LOWER_FIRST_ASCII, ALPHA_LOWER_LAST_ASCII, ALPHA_UPPER_FIRST_ASCII, ALPHA_UPPER_LAST_ASCII, DICT_RANGES, DEFAULT_OPTIONS, ShortUniqueId;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [
            function (version_ts_1_1) {
                version_ts_1 = version_ts_1_1;
            }
        ],
        execute: function () {
            DEFAULT_UUID_LENGTH = 6;
            DIGIT_FIRST_ASCII = 48;
            DIGIT_LAST_ASCII = 58;
            ALPHA_LOWER_FIRST_ASCII = 97;
            ALPHA_LOWER_LAST_ASCII = 123;
            ALPHA_UPPER_FIRST_ASCII = 65;
            ALPHA_UPPER_LAST_ASCII = 91;
            DICT_RANGES = {
                digits: [DIGIT_FIRST_ASCII, DIGIT_LAST_ASCII],
                lowerCase: [ALPHA_LOWER_FIRST_ASCII, ALPHA_LOWER_LAST_ASCII],
                upperCase: [ALPHA_UPPER_FIRST_ASCII, ALPHA_UPPER_LAST_ASCII],
            };
            DEFAULT_OPTIONS = {
                dictionary: [],
                shuffle: true,
                debug: false,
                length: DEFAULT_UUID_LENGTH,
            };
            ShortUniqueId = class ShortUniqueId extends Function {
                constructor(argOptions = {}) {
                    super();
                    this.dictIndex = 0;
                    this.dictRange = [];
                    this.lowerBound = 0;
                    this.upperBound = 0;
                    this.dictLength = 0;
                    const options = {
                        ...DEFAULT_OPTIONS,
                        ...argOptions,
                    };
                    this.counter = 0;
                    this.debug = false;
                    this.dict = [];
                    this.version = version_ts_1.default;
                    const { dictionary: userDict, shuffle, length, } = options;
                    this.uuidLength = length;
                    if (userDict && userDict.length > 1) {
                        this.setDictionary(userDict);
                    }
                    else {
                        let i;
                        this.dictIndex = i = 0;
                        Object.keys(DICT_RANGES).forEach((rangeType) => {
                            const rangeTypeKey = rangeType;
                            this.dictRange = DICT_RANGES[rangeTypeKey];
                            this.lowerBound = this.dictRange[0];
                            this.upperBound = this.dictRange[1];
                            for (this.dictIndex = i = this.lowerBound; this.lowerBound <= this.upperBound ? i < this.upperBound : i > this.upperBound; this.dictIndex = this.lowerBound <= this.upperBound ? i += 1 : i -= 1) {
                                this.dict.push(String.fromCharCode(this.dictIndex));
                            }
                        });
                    }
                    if (shuffle) {
                        const PROBABILITY = 0.5;
                        this.setDictionary(this.dict.sort(() => Math.random() - PROBABILITY));
                    }
                    else {
                        this.setDictionary(this.dict);
                    }
                    this.debug = options.debug;
                    this.log(this.dict);
                    this.log((`Generator instantiated with Dictionary Size ${this.dictLength}`));
                    return new Proxy(this, {
                        apply: (target, that, args) => this.randomUUID(...args),
                    });
                }
                log(...args) {
                    const finalArgs = [...args];
                    finalArgs[0] = `[short-unique-id] ${args[0]}`;
                    if (this.debug === true) {
                        if (typeof console !== 'undefined' && console !== null) {
                            return console.log(...finalArgs);
                        }
                    }
                }
                setDictionary(dictionary) {
                    this.dict = dictionary;
                    this.dictLength = this.dict.length;
                    this.counter = 0;
                }
                seq() {
                    return this.sequentialUUID();
                }
                sequentialUUID() {
                    let counterDiv;
                    let counterRem;
                    let id = '';
                    counterDiv = this.counter;
                    while (true) {
                        counterRem = counterDiv % this.dictLength;
                        counterDiv = Math.trunc(counterDiv / this.dictLength);
                        id += this.dict[counterRem];
                        if (counterDiv === 0) {
                            break;
                        }
                    }
                    this.counter += 1;
                    return id;
                }
                randomUUID(uuidLength = this.uuidLength || DEFAULT_UUID_LENGTH) {
                    let id;
                    let randomPartIdx;
                    let j;
                    let idIndex;
                    if ((uuidLength === null || typeof uuidLength === 'undefined') || uuidLength < 1) {
                        throw new Error('Invalid UUID Length Provided');
                    }
                    id = '';
                    for (idIndex = j = 0; 0 <= uuidLength ? j < uuidLength : j > uuidLength; idIndex = 0 <= uuidLength ? j += 1 : j -= 1) {
                        randomPartIdx = parseInt((Math.random() * this.dictLength).toFixed(0), 10) % this.dictLength;
                        id += this.dict[randomPartIdx];
                    }
                    return id;
                }
                availableUUIDs(uuidLength = this.uuidLength) {
                    return parseFloat(Math.pow([...new Set(this.dict)].length, uuidLength).toFixed(0));
                }
                approxMaxBeforeCollision(rounds = this.availableUUIDs(this.uuidLength)) {
                    return parseFloat(Math.sqrt((Math.PI / 2) * rounds).toFixed(20));
                }
                collisionProbability(rounds = this.availableUUIDs(this.uuidLength), uuidLength = this.uuidLength) {
                    return parseFloat((this.approxMaxBeforeCollision(rounds) / this.availableUUIDs(uuidLength)).toFixed(20));
                }
                uniqueness(rounds = this.availableUUIDs(this.uuidLength)) {
                    const score = parseFloat((1 - (this.approxMaxBeforeCollision(rounds) / rounds)).toFixed(20));
                    return (score > 1) ? (1) : ((score < 0) ? 0 : score);
                }
                getVersion() {
                    return this.version;
                }
            };
            exports_2("default", ShortUniqueId);
        }
    };
});

const __exp = __instantiate("mod", false);
exports. default = __exp["default"];
