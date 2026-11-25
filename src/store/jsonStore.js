import { promises as fs } from 'node:fs';
import path from 'node:path';

const emptyDb = () => ({ teams: [], players: [], matches: [] });

/**
 * A tiny JSON-file "database".
 *  - read()          -> the whole database object
 *  - update(fn)      -> run fn(db) (it may change db), then save. Calls are queued
 *                       one after another so two requests never write at the same time.
 *                       If fn throws, nothing is saved.
 * Files are written to a temp file first and then renamed, so a crash never leaves
 * a half-written db.json.
 */
export function createStore(filePath, seedPath) {
  let queue = Promise.resolve();

  async function ensureFile() {
    try {
      await fs.access(filePath);
    } catch {
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      let initial = JSON.stringify(emptyDb(), null, 2);
      if (seedPath) {
        try {
          initial = await fs.readFile(seedPath, 'utf8');
        } catch {
          /* no seed file: start empty */
        }
      }
      await fs.writeFile(filePath, initial);
    }
  }

  async function read() {
    await ensureFile();
    const text = await fs.readFile(filePath, 'utf8');
    return { ...emptyDb(), ...JSON.parse(text) };
  }

  async function write(db) {
    const tmp = `${filePath}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(db, null, 2));
    await fs.rename(tmp, filePath);
  }

  function update(mutator) {
    const run = queue.then(async () => {
      const db = await read();
      const result = await mutator(db);
      await write(db);
      return result;
    });
    queue = run.catch(() => {});
    return run;
  }

  return { read, update };
}
