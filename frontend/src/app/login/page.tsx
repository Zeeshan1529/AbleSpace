'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { LogIn, Sparkles, User, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const { loginAsGuest, loginWithGoogle } = useApp();
  const [guestName, setGuestName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGuestLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await loginAsGuest(guestName.trim() || 'Guest User');
    } catch (err) {
      setError('Guest login failed. Is the backend server running?');
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await loginWithGoogle();
    } catch (err) {
      setError('Google mockup login failed. Is the backend server running?');
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-theme-bg px-4 overflow-hidden">
      {/* Abstract Background Blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] pointer-events-none transition-colors duration-1000" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[100px] pointer-events-none transition-colors duration-1000" />

      <div className="w-full max-w-md animate-fade-in">
        {/* Logo / Branding */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary text-white shadow-xl shadow-primary/20 mb-3 transition-colors duration-300">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-theme-text select-none">
            AbleSpace
          </h1>
          <p className="text-sm text-theme-text-secondary mt-1.5 font-medium">
            Task Management System
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-theme-card border border-theme-border rounded-3xl shadow-xl shadow-black/[0.03] p-8 transition-colors duration-300">
          <h2 className="text-xl font-bold text-theme-text mb-2">Welcome</h2>
          <p className="text-sm text-theme-text-secondary mb-6">
            Sign in to start planning and tracking your work.
          </p>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Social / Mockup Google Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full h-12 flex items-center justify-center gap-3 px-4 border border-theme-border hover:bg-theme-bg text-theme-text font-semibold rounded-2xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none mb-6"
          >
            {/* Simple Google SVG Icon */}
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.58c-.28 1.48-1.12 2.74-2.38 3.58v2.98h3.84c2.24-2.06 3.7-5.1 3.7-8.41z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.84-2.98c-1.08.73-2.45 1.16-4.12 1.16-3.17 0-5.85-2.14-6.81-5.02H1.31v3.09C3.28 21.09 7.37 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.19 14.25c-.24-.73-.38-1.5-.38-2.25s.14-1.52.38-2.25V6.66H1.31C.48 8.32 0 10.12 0 12s.48 3.68 1.31 5.34l3.88-3.09z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.97 1.19 15.24 0 12 0 7.37 0 3.28 2.91 1.31 6.66l3.88 3.09c.96-2.88 3.64-5.02 6.81-5.02z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative flex py-2 items-center mb-6">
            <div className="flex-grow border-t border-theme-border"></div>
            <span className="flex-shrink mx-4 text-xs font-semibold tracking-wider text-theme-text-secondary uppercase">
              Or
            </span>
            <div className="flex-grow border-t border-theme-border"></div>
          </div>

          {/* Guest Login Form */}
          <form onSubmit={handleGuestLogin} className="space-y-4">
            <div>
              <label htmlFor="guestName" className="block text-xs font-bold uppercase tracking-wider text-theme-text-secondary mb-2 ml-1">
                Display Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-theme-text-secondary/70">
                  <User className="w-5 h-5" />
                </div>
                <input
                  id="guestName"
                  type="text"
                  placeholder="Enter your name..."
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  disabled={isLoading}
                  className="w-full h-12 pl-11 pr-4 bg-theme-bg border border-theme-border focus:border-primary/50 text-theme-text placeholder:text-theme-text-secondary/50 font-medium rounded-2xl focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all duration-200"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 flex items-center justify-center gap-2 bg-primary text-white hover:bg-primary-hover font-semibold rounded-2xl shadow-lg shadow-primary/10 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
            >
              <LogIn className="w-5 h-5" />
              <span>{isLoading ? 'Signing in...' : 'Sign in as Guest'}</span>
            </button>
          </form>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs font-semibold text-theme-text-secondary/70 mt-8">
          AbleSpace v1.0.0 &bull; Secure sandbox preview
        </p>
      </div>
    </div>
  );
}
