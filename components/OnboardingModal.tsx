'use client';

import { useState } from 'react';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

const STEPS = [
  {
    title: 'Welcome to Flappy Bird!',
    description: 'Tap anywhere to make the bird fly. Avoid the pipes and see how far you can go!',
    icon: '🐦',
  },
  {
    title: 'Avoid the Pipes',
    description: 'Navigate through the gaps between pipes. Each pipe you pass increases your score!',
    icon: '🚧',
  },
  {
    title: 'Compete Globally',
    description: 'Your high scores are saved onchain. Compete with players worldwide on the leaderboard!',
    icon: '🏆',
  },
];

export function OnboardingModal({ isOpen, onComplete }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const isLastStep = currentStep === STEPS.length - 1;
  const step = STEPS[currentStep];

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-300">
        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-6">
          {STEPS.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentStep
                  ? 'w-8 bg-blue-600'
                  : 'w-2 bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>

        {/* Icon */}
        <div className="text-6xl text-center mb-4">{step.icon}</div>

        {/* Content */}
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-3">
          {step.title}
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          {step.description}
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          {!isLastStep && (
            <button
              onClick={handleSkip}
              className="flex-1 px-4 py-3 rounded-lg font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Skip
            </button>
          )}
          <button
            onClick={handleNext}
            className={`${
              isLastStep ? 'flex-1' : 'flex-1'
            } px-4 py-3 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors`}
          >
            {isLastStep ? 'Get Started' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
