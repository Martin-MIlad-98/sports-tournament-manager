// Resets data/db.json back to the test data in data/seed.json.
import { copyFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
await copyFile(path.join(root, 'data', 'seed.json'), path.join(root, 'data', 'db.json'));
console.log('data/db.json reset from data/seed.json');
