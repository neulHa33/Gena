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
// Make it a singleton to ensure data persistence across requests
let dbData: Data = { ...defaultData };

// Initialize with some sample data if empty
if (dbData.dashboards.length === 0 && dbData.charts.length === 0) {
  dbData = {
    dashboards: [],
    charts: [],
  };
}

export async function readDb() {
  try {
    return { data: dbData };
  } catch (error) {
    console.error('Error reading database:', error);
    return { data: defaultData };
  }
}

export async function writeDb() {
  try {
    // In-memory storage, no need to write to file
    // Just ensure the data is persisted in memory
    return Promise.resolve();
  } catch (error) {
    console.error('Error writing database:', error);
    return Promise.reject(error);
  }
}

// Legacy sync functions for backward compatibility (if needed)
export function getDb() {
  return dbData;
}

export function setDb(newDb: Data) {
  dbData = newDb;
} 