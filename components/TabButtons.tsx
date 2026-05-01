'use client';

type AuthMode = 'login' | 'signup' | null;

interface TabButtonsProps {
  currentMode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
}

export function TabButtons({
  currentMode,
  onModeChange,
}: TabButtonsProps): React.ReactElement {
  return (
    <div className="flex gap-4 mb-8" role="tablist">
      <button
        role="tab"
        aria-selected={currentMode === 'login'}
        onClick={() => onModeChange('login')}
        className={`flex-1 py-3 px-4 font-semibold rounded-lg transition-colors ${
          currentMode === 'login'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        Login
      </button>
      <button
        role="tab"
        aria-selected={currentMode === 'signup'}
        onClick={() => onModeChange('signup')}
        className={`flex-1 py-3 px-4 font-semibold rounded-lg transition-colors ${
          currentMode === 'signup'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        Sign Up
      </button>
    </div>
  );
}