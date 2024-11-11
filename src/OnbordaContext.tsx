"use client";
import React, { createContext, useContext, useState, useCallback } from "react";

// Types
import {OnbordaContextType, OnbordaProviderProps, Step, Tour} from "./types";

// Example Hooks Usage:
// const { setCurrentStep, closeOnborda, startOnborda } = useOnborda();

// // To trigger a specific step
// setCurrentStep(2); // step 3

// // To close/start onboarding
// closeOnborda();
// startOnborda();

const OnbordaContext = createContext<OnbordaContextType | undefined>(undefined);

const useOnborda = () => {
  const context = useContext(OnbordaContext);
  if (context === undefined) {
    throw new Error("useOnborda must be used within an OnbordaProvider");
  }
  return context;
};

const OnbordaProvider: React.FC<OnbordaProviderProps> = ({
  children,
  tours = [],
}) => {
  const [currentTour, setCurrentTour] = useState<string | null>(null);
  const [currentStep, setCurrentStepState] = useState(0);
  const [isOnbordaVisible, setOnbordaVisible] = useState(false);
  const [currentTourSteps, setCurrentTourSteps] = useState<Step[]>([]);

  const setCurrentStep = useCallback((step: number | string, delay?: number) => {
    // If step is a string, find the index of the step with that id
    if (typeof step === 'string') {
        const index = currentTourSteps.findIndex((s) => s?.id === step);
        if (index === -1) {
            throw new Error(`Step with id ${step} not found`);
        }
        step = index;
    }
    console.log('setCurrentStep', step);
    if (delay) {
      setTimeout(() => {
        setCurrentStepState(step);
        setOnbordaVisible(true);
      }, delay);
    } else {
      setCurrentStepState(step);
      setOnbordaVisible(true);
    }
  }, []);

  const closeOnborda = useCallback(() => {
    setOnbordaVisible(false);
    setCurrentTour(null);
  }, []);

  const startOnborda = useCallback((tourName: string) => {
    setCurrentTour(tourName);
    setCurrentStepState(0);
    setCurrentTourSteps(tours.find((tour) => tour.tour === tourName)?.steps || []);
    setOnbordaVisible(true);
  }, []);

  return (
    <OnbordaContext.Provider
      value={{
        currentTour,
        currentStep,
        currentTourSteps,
        setCurrentStep,
        closeOnborda,
        startOnborda,
        isOnbordaVisible,
      }}
    >
      {children}
    </OnbordaContext.Provider>
  );
};

export { OnbordaProvider, useOnborda };
