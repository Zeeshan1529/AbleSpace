'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { user, loadingUser } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!loadingUser) {
      if (user) {
        router.replace('/tasks');
      } else {
        router.replace('/login');
      }
    }
  }, [user, loadingUser, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-theme-bg">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
      <p className="mt-4 text-sm font-semibold text-theme-text-secondary select-none">
        Loading AbleSpace...
      </p>
    </div>
  );
}
