import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb } from '../../../lib/db';
import { Dashboard } from '../../../types/dashboard';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  const db = await readDb();
  return NextResponse.json(db.data.dashboards);
}

export async function POST(req: NextRequest) {
  try {
    console.log('Creating dashboard...');
    const db = await readDb();
    console.log('Database read successfully');
    
    const body = await req.json();
    console.log('Request body:', body);
    
    const { name, layout, charts, description } = body;
    
    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      console.log('Validation failed: name is required');
      return NextResponse.json(
        { error: 'Dashboard name is required' },
        { status: 400 }
      );
    }
    
    console.log('Creating new dashboard with name:', name);
    const newDashboard: Dashboard = {
      id: uuidv4(),
      name: name.trim(),
      charts: charts || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...(description ? { description: description.trim() } : {}),
    };
    
    console.log('New dashboard object:', newDashboard);
    db.data.dashboards.push(newDashboard);
    console.log('Dashboard added to database');
    
    await writeDb();
    console.log('Database written successfully');
    
    return NextResponse.json(newDashboard, { status: 201 });
  } catch (error) {
    console.error('Error creating dashboard:', error);
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
} 