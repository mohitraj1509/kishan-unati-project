'use client';

import { useOnboarding } from '@/contexts/OnboardingContext';
import OnboardingModal from './OnboardingModal';

export default function OnboardingWrapper() {
  const { showOnboarding, completeOnboarding, skipOnboarding } = useOnboarding();

  if (!showOnboarding) return null;

  return (
    <OnboardingModal 
      onComplete={completeOnboarding}
      onSkip={skipOnboarding}
    />
  );
}
