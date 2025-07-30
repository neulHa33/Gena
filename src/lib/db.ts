import { Dashboard, Chart } from '../types/dashboard';
import { promises as fs } from 'fs';
import path from 'path';

export type Data = {
  dashboards: Dashboard[];
  charts: Chart[];
};

const defaultData: Data = {
  dashboards: [],
  charts: [],
};

// File path for database
const dbPath = path.join(process.cwd(), 'data', 'db.json');

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.dirname(dbPath);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Initialize database with file-based storage
let dbData: Data = { ...defaultData };
let isInitialized = false;

async function initializeDb(): Promise<Data> {
  if (isInitialized) return dbData;

  try {
    await ensureDataDir();
    
    // Try to read existing data
    try {
      const fileContent = await fs.readFile(dbPath, 'utf-8');
      const parsed = JSON.parse(fileContent);
      
      // Validate the data structure
      if (parsed && typeof parsed === 'object' && 
          Array.isArray(parsed.dashboards) && Array.isArray(parsed.charts)) {
        dbData = parsed;
        console.log('Database loaded from file');
        isInitialized = true;
        return dbData;
      }
    } catch (fileError) {
      // File doesn't exist or is invalid, use default data
      console.log('No existing database found, initializing with default data');
    }
    
    // Initialize with default data and save to file
    dbData = { ...defaultData };
    await saveDbToFile(dbData);
    console.log('Database initialized with default data');
    isInitialized = true;
    return dbData;
    
  } catch (error) {
    console.error('Error initializing database:', error);
    dbData = { ...defaultData };
    isInitialized = true;
    return dbData;
  }
}

async function saveDbToFile(data: Data): Promise<void> {
  try {
    await ensureDataDir();
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving database to file:', error);
    throw error;
  }
}

export async function readDb() {
  const data = await initializeDb();
  return { data };
}

export async function writeDb() {
  if (!isInitialized) {
    await initializeDb();
  }
  await saveDbToFile(dbData);
}

// Legacy sync functions for backward compatibility
export function getDb() {
  return dbData;
}

export function setDb(newDb: Data) {
  dbData = newDb;
}