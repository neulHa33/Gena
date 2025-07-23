import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    labels: ['Americas', 'EMEA', 'APAC'],
    values: [320, 210, 180],
  });
} 