import { NextResponse } from 'next/server';

export async function GET() {
  return new NextResponse('Hello, this is a test!', { status: 200 });
}
