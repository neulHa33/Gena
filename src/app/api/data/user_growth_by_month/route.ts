import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    labels: [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ],
    values: [120, 180, 250, 320, 410, 500, 600, 720, 850, 1000, 1200, 1400],
  });
} 