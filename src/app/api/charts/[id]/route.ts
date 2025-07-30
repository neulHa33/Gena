import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb } from '../../../../lib/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await readDb();
  const chart = db.data.charts.find((c) => c.id === id);
  if (!chart) {
    return NextResponse.json(
      { error: 'Chart not found', message: `Chart with ID ${id} does not exist` }, 
      { status: 404 }
    );
  }
  return NextResponse.json(chart);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await readDb();
  const update = await req.json();
  
  const idx = db.data.charts.findIndex((c) => c.id === id);
  
  if (idx === -1) {
    // Chart doesn't exist, create a new one with the provided ID
    const newChart = {
      id,
      ...update,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    db.data.charts.push(newChart);
    await writeDb();
    
    return NextResponse.json(newChart, { status: 201 });
  }
  
  // Update existing chart
  const updatedChart = { 
    ...db.data.charts[idx], 
    ...update,
    updatedAt: new Date().toISOString()
  };
  
  db.data.charts[idx] = updatedChart;
  await writeDb();
  
  return NextResponse.json(updatedChart);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await readDb();
  
  const initialLength = db.data.charts.length;
  db.data.charts = db.data.charts.filter((c) => c.id !== id);
  
  if (db.data.charts.length === initialLength) {
    // Chart wasn't found
    return NextResponse.json(
      { error: 'Chart not found', message: `Chart with ID ${id} does not exist` }, 
      { status: 404 }
    );
  }
  
  await writeDb();
  return NextResponse.json({ success: true, message: `Chart ${id} deleted successfully` });
} 