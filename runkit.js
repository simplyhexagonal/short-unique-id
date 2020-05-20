const { default: ShortUniqueId } = require('short-unique-id');

const uid = new ShortUniqueId();

console.log(uid(6));
console.log(uid.seq());

console.log(uid.version);
