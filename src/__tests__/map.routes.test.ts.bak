import { createMapPoint } from "../types";
/** @jest-environment node */
import express from 'express';
import request from 'supertest';
import { mapRoutes } from '../routes/map.routes';
import dataStore from '../db';

jest.mock('../db');

describe('map routes', () => {
  const app = express();
  app.use(express.json());
  app.use('/maps', mapRoutes);

  const mockStore = dataStore as jest.Mocked<typeof dataStore>;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('lists maps', async () => {
    mockStore.listMaps.mockResolvedValue([
      createMapPoint({ id: '1', position: { lat: 0, lng: 0 }, properties: {} }),
    ]);
    const res = await request(app).get('/maps');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  it('gets a map', async () => {
    mockStore.getMap.mockResolvedValue(createMapPoint({ id: '1', position: { lat: 0, lng: 0 }, properties: {} }));
    const res = await request(app).get('/maps/1');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe('1');
  });

  it('returns 404 when map missing', async () => {
    mockStore.getMap.mockResolvedValue(undefined);
    const res = await request(app).get('/maps/2');
    expect(res.status).toBe(404);
  });

  it('creates a map', async () => {
    const body = createMapPoint({ id: '1', position: { lat: 0, lng: 0 }, properties: {} });
    mockStore.createMap.mockResolvedValue(body);
    const res = await request(app).post('/maps').send(body);
    expect(res.status).toBe(201);
    expect(res.body.id).toBe('1');
  });

  it('updates a map', async () => {
    mockStore.updateMap.mockResolvedValue({
      id: '1',
      position: { lat: 1, lng: 1 },
      properties: {},
    });
    const res = await request(app)
      .put('/maps/1')
      .send({ position: { lat: 1, lng: 1 } });
    expect(res.status).toBe(200);
    expect(res.body.position.lat).toBe(1);
  });

  it('returns 404 on update missing', async () => {
    mockStore.updateMap.mockResolvedValue(undefined);
    const res = await request(app).put('/maps/1').send({});
    expect(res.status).toBe(404);
  });

  it('deletes a map', async () => {
    mockStore.deleteMap.mockResolvedValue(true);
    const res = await request(app).delete('/maps/1');
    expect(res.status).toBe(204);
  });

  it('returns 404 on delete missing', async () => {
    mockStore.deleteMap.mockResolvedValue(false);
    const res = await request(app).delete('/maps/1');
    expect(res.status).toBe(404);
  });
});
