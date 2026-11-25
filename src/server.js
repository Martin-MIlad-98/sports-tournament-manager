import { createApp } from './app.js';

const port = Number(process.env.PORT) || 3000;
const app = await createApp({
  ...(process.env.DATA_FILE ? { dataFile: process.env.DATA_FILE } : {}),
});

app.listen(port, () => {
  console.log(`Sports Tournament Manager running at http://localhost:${port}`);
});
