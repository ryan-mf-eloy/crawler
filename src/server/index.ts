import { join } from 'node:path'
import { crawler } from '../crawler';
import express from 'express'

const app = express()

const htmlPage = join(__dirname, '..', '..', 'public/index.html');

app.use(express.static(htmlPage));

app.get('/', async (_, response) => {
  await crawler.execute()
  response.sendFile(htmlPage);
});

export default app