import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Block malicious tracking requests
  if (request.nextUrl.pathname.startsWith('/hybridaction')) {
    return new NextResponse(null, { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/hybridaction/:path*',
  ],
};
