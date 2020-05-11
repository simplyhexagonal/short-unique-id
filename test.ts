// Copyright 2017-2020 the Short Unique ID authors. All rights reserved. Apache license.
import {
  assert,
  assertEquals,
} from 'https://deno.land/std/testing/asserts.ts';

import ShortUniqueId from './mod.ts';

const { test } = Deno;

test({
  name: 'ability to show module version',
  fn(): void {
    const uid: ShortUniqueId = new ShortUniqueId({
      dictionary: ['a', 'b'],
      shuffle: false,
    });
    const version = uid.getVersion();

    assert((/^\d+\.\d+.\d+/).test(version));
  },
});

test({
  name: 'ability to generate random id\'s based on internal counter',
  fn(): void {
    const uid: ShortUniqueId = new ShortUniqueId();
    const uidCollection: string[] = [];

    /* tslint:disable no-magic-numbers */
    uidCollection.push(uid(6));
    uidCollection.push(uid(7));
    uidCollection.push(uid(10));
    assertEquals(uidCollection[0].length, 6);
    assertEquals(uidCollection[1].length, 7);
    assertEquals(uidCollection[2].length, 10);

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
    const uid: ShortUniqueId = new ShortUniqueId();
    uid.setDictionary(['v', '0', 'Y']);
    assertEquals(uid.seq(), 'v');
    assertEquals(uid.seq(), '0');
    assertEquals(uid.seq(), 'Y');
  },
});

test({
  name: 'ability to be instantiated with user-defined dictionary',
  fn(): void {
    const uid: ShortUniqueId = new ShortUniqueId({
      dictionary: ['a', '1'],
      shuffle: false,
      length: 2,
    });
    /* tslint:disable no-magic-numbers */
    assert((/^[a1][a1]$/).test(uid()));
    /* tslint:enable no-magic-numbers */
    assertEquals(
      [uid.seq(), uid.seq()].join(''),
      'a1',
    );
  },
});

test({
  name: 'ability to skip shuffle when instantiated',
  fn(): void {
    const uid: ShortUniqueId = new ShortUniqueId({ shuffle: false });
    assertEquals(uid.seq(), '0');
    assertEquals(uid.seq(), '1');
  },
});

test({
  name: 'ability to calculate total number of possible UUIDs',
  fn(): void {
    const totals = [];
    const uid: ShortUniqueId = new ShortUniqueId();
    totals.push(uid.availableUUIDs());

    uid.setDictionary(['a', 'b']);
    totals.push(uid.availableUUIDs());

    uid.setDictionary(['a', 'b', 'b', 'a']);
    totals.push(uid.availableUUIDs());

    uid.setDictionary(['a', 'b', 'b', 'a']);
    const lengthOfTwo = 2;
    totals.push(uid.availableUUIDs(lengthOfTwo));

    /* tslint:disable no-magic-numbers */
    assertEquals(totals[0], 56800235584); // 62^6
    assertEquals(totals[1], 64); // 2^6
    assertEquals(totals[2], 64); // 2^6
    assertEquals(totals[3], 4); // 2^2
    /* tslint:enable no-magic-numbers */
  },
});

test({
  name: 'ability to calculate probability of collision given number of UUID generation rounds',
  fn(): void {
    const totals: number[] = [];
    const uid: ShortUniqueId = new ShortUniqueId();
    /* tslint:disable no-magic-numbers */
    totals.push(uid.collisionProbability());
    totals.push(uid.collisionProbability(1000000));

    uid.setDictionary(['a', 'b']);
    totals.push(uid.collisionProbability(1, 1));

    uid.setDictionary(['a', 'b', 'b', 'a']);
    totals.push(uid.collisionProbability(1, 1));

    assertEquals(totals[0], 0.00000525877839496618); // sqrt((pi/2)*(62^6))/(62^6)
    assertEquals(totals[1], 0.00000002206529822331); // sqrt((pi/2)*1000000)/(62^6)
    assertEquals(totals[2], 0.6266570686577501); // sqrt(pi/2)/(2)
    assertEquals(totals[3], 0.6266570686577501); // sqrt(pi/2)/(2)
    /* tslint:enable no-magic-numbers */
  },
});

test({
  name: 'ability to calculate approx. num. of hashes before first collision',
  fn(): void {
    const totals = [];
    const uid: ShortUniqueId = new ShortUniqueId();
    totals.push(uid.approxMaxBeforeCollision());

    uid.setDictionary(['a', 'b']);
    totals.push(uid.approxMaxBeforeCollision());

    uid.setDictionary(['a', 'b', 'b', 'a']);
    totals.push(uid.approxMaxBeforeCollision());

    /* tslint:disable no-magic-numbers */
    assertEquals(totals[0], 298699.85171812854); // sqrt((pi/2)*(62^6))
    assertEquals(totals[1], 10.026513098524001); // sqrt((pi/2)*(2^6))
    assertEquals(totals[2], 10.026513098524001); // sqrt((pi/2)*(2^6))
    /* tslint:enable no-magic-numbers */
  },
});

test({
  name: 'ability to calculate "uniqueness" score of UUIDs based on size of dictionary and chosen UUID length',
  fn(): void {
    const totals = [];
    const uid: ShortUniqueId = new ShortUniqueId();
    totals.push(uid.uniqueness());
    const millionPossibleRounds = 1000000;
    totals.push(uid.uniqueness(millionPossibleRounds));

    uid.setDictionary(['a', 'a']);
    totals.push(uid.uniqueness());
    uid.setDictionary(['a', 'a', 'a', 'a']);
    totals.push(uid.uniqueness());

    const twoPossibleRounds = 2;
    uid.setDictionary(['a', 'b']);
    totals.push(uid.uniqueness(twoPossibleRounds));
    uid.setDictionary(['a', 'b', 'b', 'a']);
    totals.push(uid.uniqueness(twoPossibleRounds));

    /* tslint:disable no-magic-numbers */
    assertEquals(totals[0], 0.999994741221605); // 1 - (sqrt((pi/2)*(62^6)) / (62^6))
    assertEquals(totals[1], 0.9987466858626844); // 1 - (sqrt((pi/2)*1000000) / (62^6))
    assertEquals(totals[2], 0);
    assertEquals(totals[3], 0);
    assertEquals(totals[4], 0.11377307454724206);
    assertEquals(totals[5], 0.11377307454724206);
    /* tslint:enable no-magic-numbers */
  },
});
