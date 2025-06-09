/** @jest-environment node */
import express from 'express';
import request from 'supertest';
import { userRoutes } from '../routes/user.routes';
import dataStore from '../db/data-store';

jest.mock('../db/data-store');

describe('user routes', () => {
  const app = express();
  app.use(express.json());
  app.use('/users', userRoutes);

  const mockStore = dataStore as jest.Mocked<typeof dataStore>;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('lists users', async () => {
    mockStore.listUsers.mockResolvedValue([{ id: '1', name: 'a', email: 'b' }]);
    const res = await request(app).get('/users');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  it('gets a user', async () => {
    mockStore.getUser.mockResolvedValue({ id: '1', name: 'a', email: 'b' });
    const res = await request(app).get('/users/1');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe('1');
  });

  it('returns 404 when user missing', async () => {
    mockStore.getUser.mockResolvedValue(undefined);
    const res = await request(app).get('/users/2');
    expect(res.status).toBe(404);
  });

  it('creates a user', async () => {
    mockStore.createUser.mockResolvedValue({ id: '1', name: 'a', email: 'b' });
    const res = await request(app).post('/users').send({ name: 'a', email: 'b' });
    expect(res.status).toBe(201);
    expect(res.body.id).toBe('1');
  });

  it('updates a user', async () => {
    mockStore.updateUser.mockResolvedValue({ id: '1', name: 'c', email: 'd' });
    const res = await request(app).put('/users/1').send({ name: 'c' });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('c');
  });

  it('returns 404 on update missing', async () => {
    mockStore.updateUser.mockResolvedValue(undefined);
    const res = await request(app).put('/users/1').send({ name: 'c' });
    expect(res.status).toBe(404);
  });

  it('deletes a user', async () => {
    mockStore.deleteUser.mockResolvedValue(true);
    const res = await request(app).delete('/users/1');
    expect(res.status).toBe(204);
  });

  it('returns 404 on delete missing', async () => {
    mockStore.deleteUser.mockResolvedValue(false);
    const res = await request(app).delete('/users/1');
    expect(res.status).toBe(404);
  });
});
