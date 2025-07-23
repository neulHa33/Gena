import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    values: [4.2, 4.1, 4.3, 4.5, 4.4, 4.6, 4.7, 4.8, 4.6, 4.9, 4.8, 4.9]
  });
} 