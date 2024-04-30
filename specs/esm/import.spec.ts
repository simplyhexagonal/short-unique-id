import ShortUniqueId from '../../dist/short-unique-id.js';

const suid = new ShortUniqueId({length: 3});

console.log(suid.rnd());
