import { create } from 'zustand';

interface AuthRequest {
  email: string;
  password: string;
  mode: 'login' | 'signup';
}

interface AuthResult {
  ok: boolean;
  error?: string;
}

interface AuthStore {
  authenticate: (request: AuthRequest) => Promise<AuthResult>;
}

export const useAuthStore = create<AuthStore>(() => ({
  authenticate: async (request: AuthRequest): Promise<AuthResult> => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      const data = await response.json() as { ok: boolean; error?: string };
      return data;
    } catch {
      return {
        ok: false,
        error: 'Network error. Please try again.',
      };
    }
  },
}));