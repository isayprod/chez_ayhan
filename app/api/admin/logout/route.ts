import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // Supprimer le cookie de session
    const cookieStore = cookies();
    cookieStore.delete({
      name: 'admin_session',
      path: '/'
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur de déconnexion admin:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la déconnexion' },
      { status: 500 }
    );
  }
}
