import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb } from '../../../../lib/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await readDb();
  const dashboard = db.data.dashboards.find((d) => d.id === id);
  if (!dashboard) {
    return NextResponse.json(
      { error: 'Dashboard not found', message: `Dashboard with ID ${id} does not exist` }, 
      { status: 404 }
    );
  }
  return NextResponse.json(dashboard);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await readDb();
  const update = await req.json();
  
  const idx = db.data.dashboards.findIndex((d) => d.id === id);
  
  if (idx === -1) {
    // Dashboard doesn't exist, create a new one with the provided ID
    const newDashboard = {
      id,
      ...update,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    db.data.dashboards.push(newDashboard);
    await writeDb();
    
    return NextResponse.json(newDashboard, { status: 201 });
  }
  
  // Update existing dashboard
  const updatedDashboard = { 
    ...db.data.dashboards[idx], 
    ...update,
    updatedAt: new Date().toISOString()
  };
  
  db.data.dashboards[idx] = updatedDashboard;
  await writeDb();
  
  return NextResponse.json(updatedDashboard);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await readDb();
  
  const initialLength = db.data.dashboards.length;
  db.data.dashboards = db.data.dashboards.filter((d) => d.id !== id);
  
  if (db.data.dashboards.length === initialLength) {
    // Dashboard wasn't found
    return NextResponse.json(
      { error: 'Dashboard not found', message: `Dashboard with ID ${id} does not exist` }, 
      { status: 404 }
    );
  }
  
  await writeDb();
  return NextResponse.json({ success: true, message: `Dashboard ${id} deleted successfully` });
} 