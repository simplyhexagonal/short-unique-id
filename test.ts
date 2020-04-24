// Copyright 2017-2020 the Short Unique ID authors. All rights reserved. Apache license.
import {
  assert,
  assertEquals,
} from 'https://deno.land/std/testing/asserts.ts';

import ShortUniqueId from './mod.ts';

const { test } = Deno;

test({
  name: 'Short Unique ID is able to generate random id\'s based on internal counter',
  fn(): void {
    const uid: ShortUniqueId = new ShortUniqueId();
    const uidCollection: string[] = [];

    /* tslint:disable no-magic-numbers */
    uidCollection.push(uid.randomUUID(6));
    uidCollection.push(uid.randomUUID(7));
    uidCollection.push(uid.randomUUID(10));
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
  name: 'Short Unique ID is able to generate consecutive id\'s based on internal counter',
  fn(): void {
    const uid: ShortUniqueId = new ShortUniqueId();
    uid.dict = ['v', '0', 'Y'];
    assertEquals(uid.sequentialUUID(), 'v');
    assertEquals(uid.sequentialUUID(), '0');
    assertEquals(uid.sequentialUUID(), 'Y');
  },
});

test({
  name: 'Short Unique ID is able to be instantiated with user-defined dictionary',
  fn(): void {
    const uid: ShortUniqueId = new ShortUniqueId({ dictionary: ['a', '1'] });
    assert((/^[a1][a1]$/).test(uid.dict.join('')));
  },
});

test({
  name: 'Short Unique ID is able to skip shuffle when instantiated',
  fn(): void {
    const uid: ShortUniqueId = new ShortUniqueId({ skipShuffle: true });
    assertEquals(uid.sequentialUUID(), '0');
    assertEquals(uid.sequentialUUID(), '1');
  },
});
