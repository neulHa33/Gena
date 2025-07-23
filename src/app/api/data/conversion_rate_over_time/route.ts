import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    labels: [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ],
    values: [2.1, 2.3, 2.5, 2.7, 2.8, 3.0, 3.2, 3.3, 3.5, 3.7, 3.8, 4.0],
  });
} 