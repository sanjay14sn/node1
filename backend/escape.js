const raw = require('./firebaseServiceAccountKey.json');

raw.private_key = raw.private_key.replace(/\n/g, '\\n');

console.log(JSON.stringify(raw));
