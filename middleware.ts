import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

export async function middleware(request: NextRequest) {
  // Vérifier si la route est /admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Vérifier si l'utilisateur est authentifié via cookie
    const adminSession = request.cookies.get('admin_session');

    // Si pas de session, rediriger vers la page de connexion admin
    if (!adminSession || adminSession.value !== 'authenticated') {
      const loginUrl = new URL('/admin/login', request.url);

      // Ne pas rediriger si on est déjà sur la page de connexion
      if (request.nextUrl.pathname !== '/admin/login') {
        return NextResponse.redirect(loginUrl);
      }
    }

    return NextResponse.next();
  }

  // Pour les autres routes, utiliser le middleware Supabase existant
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ]
};
