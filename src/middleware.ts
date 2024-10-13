import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  publicRoutes: [
    '/',
    '/sign-up(.*)',
    '/sign-in(.*)',
    '/sign-out(.*)',
    '/portal(.*)',
    '/api/v1(.*)',
  ],
  ignoredRoutes: ['/chatbot', '/api/webhooks/(.*)'],
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|_next/image|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
