// File renamed to proxy.ts for Next.js 16+ compatibility

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
