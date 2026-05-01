'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { validateEmail, validatePassword, validateConfirmPassword } from '@/lib/validation';

type AuthMode = 'login' | 'signup';

interface AuthFormProps {
  mode: AuthMode;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export function AuthForm({ mode }: AuthFormProps): React.ReactElement {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const { authenticate } = useAuthStore();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const email = e.target.value;
    setFormData((prev) => ({ ...prev, email }));
    
    if (email && !validateEmail(email)) {
      setErrors((prev) => ({
        ...prev,
        email: 'Please enter a valid email address',
      }));
    } else {
      setErrors((prev) => {
        const { email: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const password = e.target.value;
    setFormData((prev) => ({ ...prev, password }));
    
    if (password && !validatePassword(password)) {
      setErrors((prev) => ({
        ...prev,
        password: 'Password must be at least 8 characters',
      }));
    } else {
      setErrors((prev) => {
        const { password: _, ...rest } = prev;
        return rest;
      });
    }
    
    if (mode === 'signup' && formData.confirmPassword) {
      if (!validateConfirmPassword(password, formData.confirmPassword)) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: 'Passwords do not match',
        }));
      } else {
        setErrors((prev) => {
          const { confirmPassword: _, ...rest } = prev;
          return rest;
        });
      }
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const confirmPassword = e.target.value;
    setFormData((prev) => ({ ...prev, confirmPassword }));
    
    if (confirmPassword && !validateConfirmPassword(formData.password, confirmPassword)) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: 'Passwords do not match',
      }));
    } else {
      setErrors((prev) => {
        const { confirmPassword: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const isFormValid = (): boolean => {
    const { email, password, confirmPassword } = formData;
    
    if (!email || !password) return false;
    if (!validateEmail(email)) return false;
    if (!validatePassword(password)) return false;
    
    if (mode === 'signup') {
      if (!confirmPassword) return false;
      if (!validateConfirmPassword(password, confirmPassword)) return false;
    }
    
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setSuccessMessage('');
    
    if (!isFormValid()) return;
    
    setIsLoading(true);
    setErrors({});
    
    try {
      const result = await authenticate({
        email: formData.email,
        password: formData.password,
        mode,
      });
      
      if (result.ok) {
        setSuccessMessage(
          mode === 'login'
            ? 'Login successful! Redirecting to dashboard...'
            : 'Sign up successful! Redirecting to dashboard...'
        );
        setFormData({ email: '', password: '', confirmPassword: '' });
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
      } else {
        setErrors({
          general: result.error || 'Authentication failed. Please try again.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && isFormValid() && !isLoading) {
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 p-6 bg-white rounded-lg shadow"
      noValidate
    >
      {successMessage && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-800 rounded">
          {successMessage}
        </div>
      )}
      
      {errors.general && (
        <div
          role="alert"
          className="mb-6 p-4 bg-red-100 border border-red-400 text-red-800 rounded"
        >
          {errors.general}
        </div>
      )}
      
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={handleEmailChange}
          onKeyDown={handleKeyDown}
          aria-label="Email address"
          aria-describedby={errors.email ? 'email-error' : undefined}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="you@example.com"
          disabled={isLoading}
        />
        {errors.email && (
          <p id="email-error" role="alert" className="mt-1 text-sm text-red-600">
            {errors.email}
          </p>
        )}
      </div>
      
      <div className="mb-4">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={formData.password}
          onChange={handlePasswordChange}
          onKeyDown={handleKeyDown}
          aria-label="Password"
          aria-describedby={errors.password ? 'password-error' : undefined}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="••••••••"
          disabled={isLoading}
        />
        {errors.password && (
          <p id="password-error" role="alert" className="mt-1 text-sm text-red-600">
            {errors.password}
          </p>
        )}
      </div>
      
      {mode === 'signup' && (
        <div className="mb-6">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleConfirmPasswordChange}
            onKeyDown={handleKeyDown}
            aria-label="Confirm password"
            aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
            disabled={isLoading}
          />
          {errors.confirmPassword && (
            <p id="confirm-password-error" role="alert" className="mt-1 text-sm text-red-600">
              {errors.confirmPassword}
            </p>
          )}
        </div>
      )}
      
      <button
        type="submit"
        disabled={!isFormValid() || isLoading}
        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        aria-label={mode === 'login' ? 'Login button' : 'Sign up button'}
      >
        {isLoading ? 'Loading...' : mode === 'login' ? 'Login' : 'Sign Up'}
      </button>
    </form>
  );
}