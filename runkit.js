const {default: ShortUniqueId} = require('short-unique-id');

console.log('ShortUniqueId', ShortUniqueId);

const uid = new ShortUniqueId();

console.log(uid(6));
console.log(uid.seq());
