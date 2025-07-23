import { NextResponse } from 'next/server';

export async function GET() {
  // Add cache headers for better performance
  const response = NextResponse.json({
    value: 125000,
    label: "Total Revenue",
    currency: "USD"
  });

  // Set cache headers for 5 minutes
  response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
  
  return response;
} 