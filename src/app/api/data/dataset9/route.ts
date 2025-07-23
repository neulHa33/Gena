import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    labels: [
      'Research & Development',
      'Marketing & Sales',
      'Human Resources',
      'Information Technology',
      'Customer Support',
      'Finance & Accounting',
      'Operations Management',
      'Product Management'
    ],
    values: [45, 38, 12, 28, 35, 15, 22, 18]
  });
} 