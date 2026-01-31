'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireLogin?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  requireLogin = true 
}: ProtectedRouteProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      
      if (requireLogin && !authenticated) {
        // Redirect to login if page requires auth and user not logged in
        router.push('/login?redirect=' + window.location.pathname);
        setIsAuthorized(false);
      } else {
        setIsAuthorized(true);
      }
    };

    // Check auth on mount
    checkAuth();

    // Listen for auth changes
    const handleAuthChange = () => checkAuth();
    window.addEventListener('auth-change', handleAuthChange);

    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, [requireLogin, router]);

  // Show loading while checking auth
  if (isAuthorized === null) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '1.2rem', color: '#64748b', fontWeight: '500' }}>Loading...</p>
        </div>
      </div>
    );
  }

  // Show unauthorized message if not authorized
  if (!isAuthorized) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <div style={{ textAlign: 'center', background: 'white', padding: '40px', borderRadius: '12px', maxWidth: '400px' }}>
          <h2 style={{ color: '#ef4444', marginBottom: '16px' }}>Unauthorized!</h2>
          <p style={{ color: '#64748b', marginBottom: '24px' }}>This page is only for logged in users.</p>
          <a href="/login" style={{ 
            padding: '12px 24px', 
            background: '#3b82f6', 
            color: 'white', 
            borderRadius: '8px', 
            textDecoration: 'none',
            fontWeight: '600'
          }}>
            Log In
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
