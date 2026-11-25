// Skeleton smoke test: the app starts, serves the frontend and answers unknown API routes with JSON.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createApp } from '../src/app.js';

let server;
let baseUrl;
let tmpDir;

before(async () => {
  tmpDir = await mkdtemp(path.join(os.tmpdir(), 'stm-app-'));
  const app = await createApp({ dataFile: path.join(tmpDir, 'db.json') });
  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
  await rm(tmpDir, { recursive: true, force: true });
});

test('the home page is served', async () => {
  const response = await fetch(`${baseUrl}/`);
  assert.equal(response.status, 200);
  assert.match(await response.text(), /Sports Tournament Manager/);
});

test('the stylesheet and shared scripts are served', async () => {
  for (const file of ['/css/style.css', '/js/api.js', '/js/ui.js']) {
    const response = await fetch(baseUrl + file);
    assert.equal(response.status, 200, file);
  }
});

test('an unknown API route returns a JSON 404', async () => {
  const response = await fetch(`${baseUrl}/api/does-not-exist`);
  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), { error: 'Not found.' });
});

test('a broken JSON body returns a JSON 400', async () => {
  const response = await fetch(`${baseUrl}/api/anything`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{ not json',
  });
  assert.equal(response.status, 400);
  assert.equal((await response.json()).error, 'The request body is not valid JSON.');
});
