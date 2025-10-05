import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Protect dashboard routes using presence of session cookie.
export function middleware(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const isProtected = pathname.startsWith('/dashboard');
  if (!isProtected) return NextResponse.next();

  const session = request.cookies.get('session')?.value;
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};


