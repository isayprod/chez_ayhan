import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// todo: change to hashed password
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'lahmacun123';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    // Vérifier le mot de passe
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Mot de passe incorrect' },
        { status: 401 }
      );
    }

    // Créer un cookie de session (24 heures)
    const expiresIn = 60 * 60 * 24;
    const cookieStore = cookies();

    cookieStore.set({
      name: 'admin_session',
      value: 'authenticated',
      expires: Date.now() + expiresIn * 1000,
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV
        ? process.env.NODE_ENV === 'production'
        : true,
      sameSite: 'lax'
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur de connexion admin:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la connexion' },
      { status: 500 }
    );
  }
}
