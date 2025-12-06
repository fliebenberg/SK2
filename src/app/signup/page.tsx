"use client";

import { SignupForm } from '@/components/auth/SignupForm';
import { Logo } from '@/components/Logo';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function SignupPage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && theme?.includes('dark');
  const metalVariant = isDark ? 'silver-dark' : 'silver';
  const primaryColor = theme?.includes('orange') 
    ? 'hsl(24, 95%, 53%)' 
    : 'hsl(142, 70%, 50%)';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5 animate-gradient" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="relative z-10 w-full max-w-md">
        {/* Signup Form */}
        <SignupForm />
      </div>
    </div>
  );
}
