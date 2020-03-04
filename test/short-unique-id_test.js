import ShortUniqueId from '../src';

let uid;

describe('Short Unique ID Generator', () => {
  beforeEach(() => {
    uid = new ShortUniqueId();
  });
  it('should be able to generate consecutive id\'s based on internal counter', () => {
    const uidCollection = [];
    uidCollection.push(uid.randomUUID(6));
    uidCollection.push(uid.randomUUID(7));
    uidCollection.push(uid.randomUUID(10));

    expect(uidCollection[0].length).toBe(6);
    expect(uidCollection[1].length).toBe(7);
    expect(uidCollection[2].length).toBe(10);

    expect(uidCollection[0] !== uidCollection[1]).toBeTruthy();
    expect(uidCollection[0] !== uidCollection[2]).toBeTruthy();
    expect(uidCollection[1] !== uidCollection[0]).toBeTruthy();
    expect(uidCollection[1] !== uidCollection[2]).toBeTruthy();
    expect(uidCollection[2] !== uidCollection[0]).toBeTruthy();
    expect(uidCollection[2] !== uidCollection[1]).toBeTruthy();
  });
  it('should be able to generate random id\'s based on internal counter', () => {
    uid.dict = ['v', '0', 'Y'];
    expect(uid.sequentialUUID()).toEqual('v');
    expect(uid.sequentialUUID()).toEqual('0');
    expect(uid.sequentialUUID()).toEqual('Y');
  });
  it('should be able to be instantiated with user-defined dictionary', () => {
    uid = new ShortUniqueId({ dictionary: ['a', '1'] });
    expect((/^[a1][a1]$/).test(uid.dict.join(''))).toBe(true);
  });
  it('should be able to skip shuffle when instantiated', () => {
    uid = new ShortUniqueId({ skipShuffle: true });
    expect(uid.sequentialUUID()).toEqual('0');
    expect(uid.sequentialUUID()).toEqual('1');
  });
});
