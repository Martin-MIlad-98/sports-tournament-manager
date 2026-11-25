import express from 'express';
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createStore } from './store/jsonStore.js';
import { AppError } from './errors.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');

/**
 * Builds the Express app.
 * Every file in src/routes/ is loaded automatically and must export
 *   default function registerRoutes(app, { store }) { ... }
 * so each user story can add its own route file without touching this file.
 */
export async function createApp({
  dataFile = path.join(root, 'data', 'db.json'),
  seedFile = path.join(root, 'data', 'seed.json'),
} = {}) {
  const app = express();
  app.use(express.json());

  const store = createStore(dataFile, seedFile);

  const routesDir = path.join(here, 'routes');
  const routeFiles = (await readdir(routesDir)).filter((f) => f.endsWith('.js')).sort();
  for (const file of routeFiles) {
    const module = await import(pathToFileURL(path.join(routesDir, file)).href);
    module.default(app, { store });
  }

  app.use(express.static(path.join(root, 'public')));

  app.use('/api', (_req, res) => {
    res.status(404).json({ error: 'Not found.' });
  });

  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    if (err instanceof AppError) {
      return res.status(err.status).json({ error: err.message });
    }
    if (err.type === 'entity.parse.failed') {
      return res.status(400).json({ error: 'The request body is not valid JSON.' });
    }
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong on the server.' });
  });

  return app;
}
