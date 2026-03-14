import { type NextRequest, NextResponse } from 'next/server';
import { isSupabaseConfigured } from '@/lib/supabase/client';

export async function middleware(request: NextRequest) {
  // In demo mode (no Supabase), skip all auth checks
  if (!isSupabaseConfigured()) {
    return NextResponse.next();
  }

  // When Supabase is configured, refresh the session cookie
  const { updateSession } = await import('@/lib/supabase/middleware');
  return updateSession(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
