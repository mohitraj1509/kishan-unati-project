'use client';

import { usePathname } from 'next/navigation';
import { useOnboarding } from '@/contexts/OnboardingContext';
import OnboardingModal from './OnboardingModal';

export default function OnboardingWrapper() {
  const pathname = usePathname();
  const { showOnboarding, completeOnboarding, skipOnboarding } = useOnboarding();

  // Only show onboarding on home page
  if (pathname !== '/' || !showOnboarding) return null;

  return (
    <OnboardingModal 
      onComplete={completeOnboarding}
      onSkip={skipOnboarding}
    />
  );
}
