'use client';

import { useState } from 'react';
import { AuthForm } from '@/components/AuthForm';
import { TabButtons } from '@/components/TabButtons';

type AuthMode = 'login' | 'signup' | null;

export default function HomePage(): React.ReactElement {
  const [mode, setMode] = useState<AuthMode>(null);

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Authentication
        </h1>
        
        <TabButtons currentMode={mode} onModeChange={setMode} />
        
        {mode === null && (
          <div className="mt-8 p-6 bg-white rounded-lg shadow text-center">
            <p className="text-gray-600">
              Select Login or Sign Up to get started
            </p>
          </div>
        )}
        
        {mode !== null && <AuthForm mode={mode} />}
      </div>
    </main>
  );
}