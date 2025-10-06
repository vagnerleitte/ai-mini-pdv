const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, 'dev.db');

if (!fs.existsSync(dbPath)) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  fs.closeSync(fs.openSync(dbPath, 'w'));
}
