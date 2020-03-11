const ShortUniqueId = require('short-unique-id').default;

const uid = new ShortUniqueId();

console.log(uid.randomUUID(6));
