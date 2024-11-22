"use client";
import React, {createContext, useContext, useState, useCallback, useEffect} from "react";

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
  activeTour = null,
}) => {
  const [currentTour, setCurrentTourState] = useState<string | null>(null);
  const [currentStep, setCurrentStepState] = useState(0);
  const [isOnbordaVisible, setOnbordaVisible] = useState(false);
  const [currentTourSteps, setCurrentTourStepsState] = useState<Step[]>([]);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

   // Start the active tour on mount
    useEffect(() => {
        if (activeTour) {
            startOnborda(activeTour);
        }
    }, [activeTour]);

  const setCurrentStep = useCallback((step: number | string, delay?: number) => {
    // If step is a string, find the index of the step with that id
    if (typeof step === 'string') {
        const index = currentTourSteps.findIndex((s) => s?.id === step);
        if (index === -1) {
            throw new Error(`Step with id ${step} not found`);
        }
        step = index;
    }
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
    // If all steps are completed, call the onComplete function
    if (completedSteps.size === currentTourSteps.length) {
        tours.find((tour) => (tour.tour) === currentTour)?.onComplete?.();
    }
    setOnbordaVisible(false);
    setCurrentTourState(null);
    setCurrentTourStepsState([]);
    setCurrentStepState(0);
    setCompletedSteps(new Set());
  }, [currentTour, currentTourSteps, completedSteps]);


    const initializeCompletedSteps = useCallback(async (tour: Tour) => {
        // Get the initial state of the completed steps
        const completeSteps = tour?.initialCompletedStepsState && await tour.initialCompletedStepsState() || tour.steps.map(() => false);
        const firstIncomplete = completeSteps.findIndex((result) => !result);
        const completed = completeSteps.reduce<(number)[]>((acc, result, index) => {
            if (result) {
                acc.push(index);
            }
            return acc;
        }, []);
        setCompletedSteps(new Set<number>(completed));
        // If all steps are completed, return the last step
        return firstIncomplete === -1 ? tour.steps.length - 1 : firstIncomplete;

    },[currentTour]);

    const setCurrentTour = useCallback((tourName: string | null) => {
        if (!tourName) {
            closeOnborda();
            return
        }
        setCurrentTourState(tourName);
        const tour = tours.find((tour) => tour.tour === tourName)
        setCurrentTourStepsState(tour?.steps || []);
        tour && initializeCompletedSteps(tour).then(r => {
            setCurrentStep(r);
            setOnbordaVisible(true);
        });
    }, [tours]);

    const startOnborda = useCallback((tourName: string) => {
        setCurrentTour(tourName);
    }, [setCurrentTour]);


  return (
    <OnbordaContext.Provider
      value={{
        tours,
        currentTour,
        currentStep,
        currentTourSteps,
        setCurrentStep,
        closeOnborda,
        startOnborda,
        isOnbordaVisible,
        completedSteps,
        setCompletedSteps
      }}
    >
      {children}
    </OnbordaContext.Provider>
  );
};

export { OnbordaProvider, useOnborda };
