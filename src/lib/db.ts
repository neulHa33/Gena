import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { Dashboard, Chart } from '../types/dashboard';

export type Data = {
  dashboards: Dashboard[];
  charts: Chart[];
};

const defaultData: Data = {
  dashboards: [],
  charts: [],
};

// Use a file-based database for persistence
const file = './db.json';
const adapter = new JSONFile<Data>(file);
const db = new Low<Data>(adapter, defaultData);

export async function readDb() {
  await db.read();
  db.data ||= defaultData;
  return db;
}

export async function writeDb() {
  await db.write();
}

// Legacy sync functions for backward compatibility (if needed)
export function getDb() {
  return db.data || defaultData;
}

export function setDb(newDb: Data) {
  db.data = newDb;
} 