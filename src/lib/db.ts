import { Dashboard, Chart } from '../types/dashboard';

export type Data = {
  dashboards: Dashboard[];
  charts: Chart[];
};

const defaultData: Data = {
  dashboards: [],
  charts: [],
};

// Use in-memory database for Render compatibility
let dbData: Data = { ...defaultData };

export async function readDb() {
  return { data: dbData };
}

export async function writeDb() {
  // In-memory storage, no need to write to file
  return Promise.resolve();
}

// Legacy sync functions for backward compatibility (if needed)
export function getDb() {
  return dbData;
}

export function setDb(newDb: Data) {
  dbData = newDb;
} 