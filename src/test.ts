// Copyright 2017-2020 the Short Unique ID authors. All rights reserved. Apache license.
import assert from 'assert';

import ShortUniqueId from './';

const test = (
  {
    name,
    fn,
  }: {
    name: string;
    fn: () => void,
  },
) => {
  console.log(`\nTesting: ${name}`);
  fn();
};

test({
  name: 'ability to show module version',
  fn(): void {
    const { getVersion } = new ShortUniqueId({
      dictionary: ['a', 'b'],
      shuffle: false,
    });
    const version = getVersion();

    console.log(version);

    assert((/^\d+\.\d+.\d+/).test(version));
  },
});

test({
  name: 'ability to generate random id\'s of different lengths',
  fn(): void {
    const { rnd } = new ShortUniqueId();
    const uidCollection: string[] = [];

    /* tslint:disable no-magic-numbers */
    uidCollection.push(rnd(6));
    uidCollection.push(rnd(7));
    uidCollection.push(rnd(10));

    console.log(uidCollection);

    assert(uidCollection[0].length === 6);
    assert(uidCollection[1].length === 7);
    assert(uidCollection[2].length === 10);

    assert(uidCollection[0] !== uidCollection[1]);
    assert(uidCollection[0] !== uidCollection[2]);
    assert(uidCollection[1] !== uidCollection[0]);
    assert(uidCollection[1] !== uidCollection[2]);
    assert(uidCollection[2] !== uidCollection[0]);
    assert(uidCollection[2] !== uidCollection[1]);
    /* tslint:enable no-magic-numbers */
  },
});

test({
  name: 'ability to generate consecutive id\'s based on internal counter',
  fn(): void {
    const { setDictionary, seq } = new ShortUniqueId();
    setDictionary(['v', '0', 'Y']);

    let result = seq();
    console.log(result);
    assert(result === 'v');

    result = seq();
    console.log(result);
    assert(result === '0');

    result = seq();
    console.log(result);
    assert(result === 'Y');
  },
});

test({
  name: 'ability to be instantiated with default dictionaries',
  fn(): void {
    const uid = new ShortUniqueId();

    const { setDictionary, seq, rnd } = uid;

    setDictionary('number', false);
    console.log(uid.dict.join());
    assert([seq(), seq()].join('') === '01');

    setDictionary('alpha', false);
    console.log(uid.dict.join());
    assert([seq(), seq()].join('') === 'ab');
    assert(uid.dict[uid.dict.length - 1] === 'Z');

    setDictionary('alpha_lower', false);
    console.log(uid.dict.join());
    assert(uid.dict[uid.dict.length - 1] === 'z');

    setDictionary('alpha_upper', false);
    console.log(uid.dict.join());
    assert([seq(), seq()].join('') === 'AB');

    setDictionary('alphanum', false);
    console.log(uid.dict.join());
    assert([seq(), seq()].join('') === '01');
    assert(uid.dict[uid.dict.length - 1] === 'Z');

    setDictionary('alphanum_lower', false);
    console.log(uid.dict.join());
    assert([seq(), seq()].join('') === '01');
    assert(uid.dict[uid.dict.length - 1] === 'z');

    setDictionary('alphanum_upper', false);
    console.log(uid.dict.join());
    assert([seq(), seq()].join('') === '01');
    assert(uid.dict[uid.dict.length - 1] === 'Z');

    setDictionary('hex', false);
    console.log(uid.dict.join());
    assert([
      seq(), seq(), seq(), seq(),
      seq(), seq(), seq(), seq(),
      seq(), seq(), seq(), seq(),
      seq(), seq(), seq(), seq(),
    ].join('') === '0123456789abcdef');

    setDictionary('hex', true);
    const result = rnd(3);
    console.log(result);
    assert((/^[0123456789abcdef][0123456789abcdef][0123456789abcdef]$/).test(result));
  },
});

test({
  name: 'ability to be instantiated with user-defined dictionary',
  fn(): void {
    const { rnd, seq } = new ShortUniqueId({
      dictionary: ['a', '1'],
      shuffle: false,
      length: 2,
    });

    assert((/^[a1][a1]$/).test(rnd()));

    const result = [seq(), seq()].join('');
    console.log(result);
    assert(result === 'a1');
  },
});

test({
  name: 'ability to skip shuffle when instantiated',
  fn(): void {
    const { seq } = new ShortUniqueId({ shuffle: false });

    let result = seq();
    console.log(result);
    assert(result === '0');

    result = seq();
    console.log(result);
    assert(result === '1');
  },
});

test({
  name: 'ability to calculate total number of possible UUIDs',
  fn(): void {
    const totals: number[] = [];
    const { availableUUIDs, setDictionary } = new ShortUniqueId();
    totals.push(availableUUIDs());

    setDictionary(['a', 'b']);
    totals.push(availableUUIDs());

    setDictionary(['a', 'b', 'b', 'a']);
    totals.push(availableUUIDs());

    setDictionary(['a', 'b', 'b', 'a']);
    const lengthOfTwo = 2;
    totals.push(availableUUIDs(lengthOfTwo));

    console.log(totals);

    /* tslint:disable no-magic-numbers */
    assert(totals[0] === 56800235584); // 62^6
    assert(totals[1] === 64); // 2^6
    assert(totals[2] === 64); // 2^6
    assert(totals[3] === 4); // 2^2
    /* tslint:enable no-magic-numbers */
  },
});

test({
  name: 'ability to calculate probability of collision given number of UUID generation rounds',
  fn(): void {
    const totals: number[] = [];
    const { collisionProbability, setDictionary } = new ShortUniqueId();

    /* tslint:disable no-magic-numbers */
    totals.push(collisionProbability());
    totals.push(collisionProbability(1000000));

    setDictionary(['a', 'b']);
    totals.push(collisionProbability(1, 1));

    setDictionary(['a', 'b', 'b', 'a']);
    totals.push(collisionProbability(1, 1));

    console.log(totals);

    assert(totals[0] === 0.00000525877839496618); // sqrt((pi/2)*(62^6))/(62^6)
    assert(totals[1] === 0.00000002206529822331); // sqrt((pi/2)*1000000)/(62^6)
    assert(totals[2] === 0.6266570686577501); // sqrt(pi/2)/(2)
    assert(totals[3] === 0.6266570686577501); // sqrt(pi/2)/(2)
    /* tslint:enable no-magic-numbers */
  },
});

test({
  name: 'ability to calculate approx. num. of hashes before first collision',
  fn(): void {
    const totals: number[] = [];
    const { approxMaxBeforeCollision, setDictionary } = new ShortUniqueId();

    totals.push(approxMaxBeforeCollision());

    setDictionary(['a', 'b']);
    totals.push(approxMaxBeforeCollision());

    setDictionary(['a', 'b', 'b', 'a']);
    totals.push(approxMaxBeforeCollision());

    console.log(totals);

    /* tslint:disable no-magic-numbers */
    assert(totals[0] === 298699.85171812854); // sqrt((pi/2)*(62^6))
    assert(totals[1] === 10.026513098524001); // sqrt((pi/2)*(2^6))
    assert(totals[2] === 10.026513098524001); // sqrt((pi/2)*(2^6))
    /* tslint:enable no-magic-numbers */
  },
});

test({
  name: 'ability to calculate "uniqueness" score of UUIDs based on size of dictionary and chosen UUID length',
  fn(): void {
    const totals: number[] = [];
    const { uniqueness, setDictionary } = new ShortUniqueId();

    totals.push(uniqueness());
    const millionPossibleRounds = 1000000;
    totals.push(uniqueness(millionPossibleRounds));

    setDictionary(['a', 'a']);
    totals.push(uniqueness());
    setDictionary(['a', 'a', 'a', 'a']);
    totals.push(uniqueness());

    const twoPossibleRounds = 2;
    setDictionary(['a', 'b']);
    totals.push(uniqueness(twoPossibleRounds));
    setDictionary(['a', 'b', 'b', 'a']);
    totals.push(uniqueness(twoPossibleRounds));

    console.log(totals);

    /* tslint:disable no-magic-numbers */
    assert(totals[0] === 0.999994741221605); // 1 - (sqrt((pi/2)*(62^6)) / (62^6))
    assert(totals[1] === 0.9987466858626844); // 1 - (sqrt((pi/2)*1000000) / (62^6))
    assert(totals[2] === 0);
    assert(totals[3] === 0);
    assert(totals[4] === 0.11377307454724206);
    assert(totals[5] === 0.11377307454724206);
    /* tslint:enable no-magic-numbers */
  },
});

test({
  name: 'ability to generate UUIDs that include an extractable timestamp',
  fn(): void {
    const { stamp, parseStamp } = new ShortUniqueId();

    /* tslint:disable no-magic-numbers */
    const nowTenStamp = parseInt(Math.floor(+new Date() / 1000).toString(16), 16) * 1000;
    const tenStamp = stamp(10);
    console.log(tenStamp);
    assert(tenStamp.length === 10);
    /* tslint:enable no-magic-numbers */

    const parsedTenStamp = parseStamp(tenStamp);
    console.log(+parsedTenStamp, nowTenStamp);
    assert(+parsedTenStamp === nowTenStamp);

    /* tslint:disable no-magic-numbers */
    const pastDate = new Date('2020-04-24');
    const nowOmniStamp = parseInt(Math.floor(+pastDate / 1000).toString(16), 16) * 1000;
    const omniStamp = stamp(42, pastDate);
    console.log(omniStamp);
    assert(omniStamp.length === 42);
    /* tslint:enable no-magic-numbers */

    const parsedOmniStamp = parseStamp(omniStamp);
    console.log(+parsedOmniStamp, nowOmniStamp);
    assert(+parsedOmniStamp === nowOmniStamp);

    const isoOmniStamp = (new Date(+parsedOmniStamp)).toISOString();
    console.log(isoOmniStamp);
    assert(isoOmniStamp === '2020-04-24T00:00:00.000Z');
  },
});

test({
  name: 'ability to create custom formatted UUID',
  fn(): void {
    const { stamp, fmt } = new ShortUniqueId({
      dictionary: ['a', 'b'],
      shuffle: false,
    });

    let testRegex = new RegExp(`[0-9abcdef]{11}[0-3]-a-[ab]{2}`);
    let result = fmt('$t12-$s0-$r2');

    console.log(result);
    assert((testRegex).test(result));

    testRegex = new RegExp(`Time: ${stamp(0)} ID: 0b-[ab]{4}`);
    result = fmt('Time: $t0 ID: $s2-$r4');

    console.log(result);
    assert((testRegex).test(result));

    const timestamp = new Date('2023-01-29T03:21:21.000Z');
    testRegex = new RegExp(`Time: ${stamp(0, timestamp)} ID: ab-[ab]{4}`);
    result = fmt('Time: $t0 ID: $s2-$r4', timestamp);

    console.log(result);
    assert((testRegex).test(result));
  },
});

test({
  name: 'ability to create custom formatted UUID with an extractable timestamp',
  fn(): void {
    const { fmt, parseStamp } = new ShortUniqueId({
      dictionary: ['a', 'b'],
      shuffle: false,
    });

    const timestamp = new Date('2023-01-29T03:21:21.000Z');
    const nowStamp = parseInt(Math.floor(+timestamp / 1000).toString(16), 16) * 1000;
    const format = '$r2-$t12-$s2';
    const result = fmt(format, timestamp);
    console.log(result);

    const parsedStamp = parseStamp(result, format);
    console.log(parsedStamp);
    assert(+parsedStamp === nowStamp);
  },
});
