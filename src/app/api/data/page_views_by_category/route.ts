import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    labels: ['Home', 'Pricing', 'Docs', 'Blog', 'Contact'],
    values: [3200, 2100, 4100, 1500, 900],
  });
} 