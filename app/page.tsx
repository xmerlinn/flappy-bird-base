'use client';

import { useEffect, useState } from 'react';
import { GameCanvas } from '@/components/game/GameCanvas';
import { OnboardingModal } from '@/components/OnboardingModal';
import { PaymentScreen } from '@/components/PaymentScreen';
import { useServiceWorker } from '@/lib/hooks';
import { useSettingsStore } from '@/lib/store';
import { PaymentService } from '@/lib/payment';

export default function Home() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Register service worker for offline gameplay
  useServiceWorker();

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check payment status (only on client)
  useEffect(() => {
    if (mounted) {
      setHasPaid(PaymentService.hasPaid());
    }
  }, [mounted]);

  // Show onboarding for first-time users (after payment)
  useEffect(() => {
    if (mounted && hasPaid) {
      const tutorialCompleted = useSettingsStore.getState().tutorialCompleted;
      if (!tutorialCompleted) {
        setShowOnboarding(true);
      }
    }
  }, [mounted, hasPaid]);

  const handleOnboardingComplete = () => {
    useSettingsStore.getState().completeTutorial();
    setShowOnboarding(false);
  };

  const handlePaymentComplete = () => {
    setHasPaid(true);
  };

  // Show loading during hydration
  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-primary to-primary-dark dark:from-gray-900 dark:to-gray-800">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Show payment screen if not paid
  if (!hasPaid) {
    return <PaymentScreen onPaymentComplete={handlePaymentComplete} />;
  }

  // Show game after payment
  return (
    <>
      <OnboardingModal
        isOpen={showOnboarding}
        onComplete={handleOnboardingComplete}
      />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-primary to-primary-dark dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="w-full max-w-md h-[calc(100vh-2rem)] max-h-[800px]">
          <GameCanvas />
        </div>
      </div>
    </>
  );
}
