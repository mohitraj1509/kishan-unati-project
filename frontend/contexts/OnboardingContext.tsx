'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { isAuthenticated } from '../lib/auth';

interface UserPreferences {
  language: string;
  name: string;
  state: string;
  district: string;
  pincode: string;
  isLoggedIn: boolean;
}

interface OnboardingContextType {
  isOnboarded: boolean;
  showOnboarding: boolean;
  userPreferences: UserPreferences | null;
  setShowOnboarding: (show: boolean) => void;
  completeOnboarding: (data: UserPreferences) => void;
  skipOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isOnboarded, setIsOnboarded] = useState(true);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);

  useEffect(() => {
    const preferences = localStorage.getItem('userPreferences');
    if (preferences) {
      setUserPreferences(JSON.parse(preferences));
    }

    const syncAuthState = () => {
      const isAuth = isAuthenticated();
      setShowOnboarding(!isAuth);
      setIsOnboarded(isAuth);
    };

    syncAuthState();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        syncAuthState();
      }
    };

    const handleAuthChange = () => {
      syncAuthState();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth-change', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);

  const completeOnboarding = (data: UserPreferences) => {
    setUserPreferences(data);
    const isAuth = isAuthenticated();
    setIsOnboarded(isAuth);
    setShowOnboarding(false);
    localStorage.setItem('userPreferences', JSON.stringify(data));
  };

  const skipOnboarding = () => {
    const isAuth = isAuthenticated();
    setIsOnboarded(isAuth);
    setShowOnboarding(false);
  };

  return (
    <OnboardingContext.Provider
      value={{
        isOnboarded,
        showOnboarding,
        userPreferences,
        setShowOnboarding,
        completeOnboarding,
        skipOnboarding
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
}
