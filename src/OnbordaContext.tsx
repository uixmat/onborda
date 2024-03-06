"use client";
import React, { createContext, useContext, useState, useCallback } from "react";

// Types
import { OnbordaContextType } from "./types";

// Example Hooks Usage:
// const { setCurrentStep, closeOnborda } = useOnborda();

// // To trigger a specific step
// setCurrentStep(2); // Opens the onboarding overlay and goes to step 3

// // To close the onboarding
// closeOnborda(); // Closes the onboarding overlay

const OnbordaContext = createContext<OnbordaContextType | undefined>(undefined);

const useOnborda = () => {
  const context = useContext(OnbordaContext);
  if (context === undefined) {
    throw new Error("useOnborda must be used within an OnbordaProvider");
  }
  return context;
};

const OnbordaProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentStep, setCurrentStepState] = useState(0);
  const [isOnbordaVisible, setOnbordaVisible] = useState(true);

  const setCurrentStep = useCallback((step: number, delay?: number) => {
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
  }, []);

  return (
    <OnbordaContext.Provider
      value={{ currentStep, setCurrentStep, closeOnborda, isOnbordaVisible }}
    >
      {children}
    </OnbordaContext.Provider>
  );
};

export { OnbordaProvider, useOnborda };
