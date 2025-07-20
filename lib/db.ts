// lib/db.ts
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

type Data = {
  dashboards: {
    id: string;
    name: string;
  }[];
  charts: {
    id: string;
    dashboardId: string;
    type: 'number' | 'bar' | 'line';
    title: string;
    dataEndpoint: string;
  }[];
};

const adapter = new JSONFile<Data>('db.json');
const db = new Low<Data>(adapter, {
  dashboards: [],
  charts: [],
});

const getDB = async () => {
  await db.read();
  return db;
};

export default getDB;
