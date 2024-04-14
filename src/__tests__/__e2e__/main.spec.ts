import 'dotenv/config'
import { describe, it, beforeAll, afterAll, expect } from 'vitest';
import app from '../../server'
import type { Server } from 'http';

let server: Server

describe('App run', () => {
  beforeAll(() => {
    server = app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`)
    });
  });

  afterAll(() => {
    server.close()
  });
  
  it('should be able return a HTML Page with scrapped data', async () => {
    const response = await fetch(process.env.API_BASE_URL!)
    const content = await response.text()

    expect(content).toContain('<!DOCTYPE html>')
  });
});