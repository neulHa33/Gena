import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb } from '../../../lib/db';
import { Chart, ChartType } from '../../../types/dashboard';
import { v4 as uuidv4 } from 'uuid';

export async function GET(req: NextRequest) {
  const db = await readDb();
  const { searchParams } = new URL(req.url);
  const dashboardId = searchParams.get('dashboardId');
  
  if (dashboardId) {
    const filteredCharts = db.data.charts.filter((chart) => chart.dashboardId === dashboardId);
    return NextResponse.json(filteredCharts);
  }
  
  return NextResponse.json(db.data.charts);
}

export async function POST(req: NextRequest) {
  try {
    const db = await readDb();
    const { dashboardId, type, title, dataEndpoint, color, x, y, w, h } = await req.json();
    
    // Validate required fields
    if (!dashboardId || typeof dashboardId !== 'string') {
      return NextResponse.json(
        { error: 'Dashboard ID is required' },
        { status: 400 }
      );
    }
    
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Chart title is required' },
        { status: 400 }
      );
    }
    
    if (!type || typeof type !== 'string') {
      return NextResponse.json(
        { error: 'Chart type is required' },
        { status: 400 }
      );
    }
    
    const newChart: Chart = {
      id: uuidv4(),
      dashboardId,
      type: type as ChartType,
      title: title.trim(),
      dataEndpoint,
      color: color || '#60a5fa',
      x: x || 0,
      y: y || 0,
      w: w || 1,
      h: h || 1,
    };
    
    db.data.charts.push(newChart);
    await writeDb();
    
    return NextResponse.json(newChart, { status: 201 });
  } catch (error) {
    console.error('Error creating chart:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}