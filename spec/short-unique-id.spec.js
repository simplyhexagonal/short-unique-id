var ShortUniqueId = require('../lib/short-unique-id.js');

var uid;

describe('Short Unique ID Generator', function() {
  beforeEach(function() {
    uid = new ShortUniqueId();
  });
  it('should be able to generate consecutive id\'s based on internal counter', function() {
    var uid_collection = [];
    uid_collection.push(uid.randomUUID(6));
    uid_collection.push(uid.randomUUID(7));
    uid_collection.push(uid.randomUUID(10));

    expect(uid_collection[0].length).toBe(6);
    expect(uid_collection[1].length).toBe(7);
    expect(uid_collection[2].length).toBe(10);

    expect(uid_collection[0] !== uid_collection[1]).toBeTruthy();
    expect(uid_collection[0] !== uid_collection[2]).toBeTruthy();
    expect(uid_collection[1] !== uid_collection[0]).toBeTruthy();
    expect(uid_collection[1] !== uid_collection[2]).toBeTruthy();
    expect(uid_collection[2] !== uid_collection[0]).toBeTruthy();
    expect(uid_collection[2] !== uid_collection[1]).toBeTruthy();
  });
  it('should be able to generate random id\'s based on internal counter', function() {
    uid.dict = ['v', '0', 'Y'];
    expect(uid.sequentialUUID()).toEqual('v');
    expect(uid.sequentialUUID()).toEqual('0');
    expect(uid.sequentialUUID()).toEqual('Y');
  });
});