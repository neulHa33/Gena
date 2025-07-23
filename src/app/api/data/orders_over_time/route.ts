import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    values: [120, 200, 150, 170, 210, 250],
  });
} 