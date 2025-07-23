import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    labels: ['Speed', 'Reliability', 'Usability', 'Security', 'Scalability', 'Cost Efficiency'],
    values: [85, 92, 78, 95, 88, 82]
  });
} 