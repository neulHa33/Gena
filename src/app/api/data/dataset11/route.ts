import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    labels: ['USA', 'China', 'Japan', 'Germany', 'India', 'UK', 'France', 'Italy'],
    values: [21400000, 14300000, 4230000, 4070000, 3380000, 3070000, 2780000, 2010000]
  });
} 