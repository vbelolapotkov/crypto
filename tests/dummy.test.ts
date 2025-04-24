import request from 'supertest';
import app from '../src/app';

describe('Root path', () => {
  it('should return hello world', async () => {
    const response = await request(app).get('/').expect(200);

    expect(response.text).toBe('Hello World!');
  });
});
