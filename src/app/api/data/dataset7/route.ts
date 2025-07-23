import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    labels: ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Beauty'],
    values: [45000, 32000, 18000, 25000, 15000, 22000]
  });
} 