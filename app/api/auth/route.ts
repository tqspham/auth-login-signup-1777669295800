import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

interface AuthRequest {
  email: string;
  password: string;
  mode: 'login' | 'signup';
}

interface AuthResponse {
  ok: boolean;
  error?: string;
}

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPassword = (password: string): boolean => {
  return password.length >= 8;
};

export async function POST(req: NextRequest): Promise<NextResponse<AuthResponse>> {
  try {
    const body = await req.json() as AuthRequest;
    const { email, password, mode } = body;

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { ok: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (!isValidPassword(password)) {
      return NextResponse.json(
        { ok: false, error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    if (mode === 'login') {
      const { data, error } = await supabase
        .from('auth_login_signup_1777669295800_users')
        .select('id')
        .eq('email', email)
        .eq('password', password)
        .single();

      if (error || !data) {
        return NextResponse.json(
          { ok: false, error: 'Invalid email or password' },
          { status: 401 }
        );
      }

      return NextResponse.json({ ok: true });
    } else if (mode === 'signup') {
      const { data: existingUser, error: checkError } = await supabase
        .from('auth_login_signup_1777669295800_users')
        .select('id')
        .eq('email', email)
        .single();

      if (existingUser) {
        return NextResponse.json(
          { ok: false, error: 'Email already registered' },
          { status: 409 }
        );
      }

      if (checkError && checkError.code !== 'PGRST116') {
        return NextResponse.json(
          { ok: false, error: 'Database error' },
          { status: 500 }
        );
      }

      const { error: insertError } = await supabase
        .from('auth_login_signup_1777669295800_users')
        .insert([
          {
            email,
            password,
            created_at: new Date().toISOString(),
          },
        ]);

      if (insertError) {
        return NextResponse.json(
          { ok: false, error: 'Failed to create account' },
          { status: 500 }
        );
      }

      return NextResponse.json({ ok: true });
    }

    return NextResponse.json(
      { ok: false, error: 'Invalid authentication mode' },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Server error' },
      { status: 500 }
    );
  }
}