'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
    // Check if user has completed onboarding
    const onboarded = localStorage.getItem('userOnboarded');
    const preferences = localStorage.getItem('userPreferences');

    if (!onboarded) {
      setShowOnboarding(true);
      setIsOnboarded(false);
    } else {
      setIsOnboarded(true);
      if (preferences) {
        setUserPreferences(JSON.parse(preferences));
      }
    }
  }, []);

  const completeOnboarding = (data: UserPreferences) => {
    setUserPreferences(data);
    setIsOnboarded(true);
    setShowOnboarding(false);
    localStorage.setItem('userOnboarded', 'true');
    localStorage.setItem('userPreferences', JSON.stringify(data));
  };

  const skipOnboarding = () => {
    setIsOnboarded(true);
    setShowOnboarding(false);
    localStorage.setItem('userOnboarded', 'true');
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
