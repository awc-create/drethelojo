import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = new Set(['/coming-soon', '/api/gate/unlock', '/favicon.ico']);

function isPublicAsset(pathname: string) {
  return (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/assets') ||
    pathname.startsWith('/fonts') ||
    pathname.startsWith('/images') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.jpeg') ||
    pathname.endsWith('.webp') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.ico')
  );
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const host = req.headers.get('host') || '';

  // recipes.drethelojo.com serves the Solene Kitchen app
  if (host.startsWith('recipes.')) {
    if (!pathname.startsWith('/recipes') && !isPublicAsset(pathname)) {
      const url = req.nextUrl.clone();
      url.pathname = '/recipes';
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  // Solene Kitchen is public (not behind the coming-soon gate)
  if (pathname.startsWith('/recipes')) {
    return NextResponse.next();
  }

  if (PUBLIC_PATHS.has(pathname) || isPublicAsset(pathname)) {
    return NextResponse.next();
  }

  const unlocked = req.cookies.get('ethel_gate')?.value === '1';
  if (unlocked) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = '/coming-soon';
  url.searchParams.set('from', pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
};
