"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useCallback, useEffect } from "react";
// Example Hooks Usage:
// const { setCurrentStep, closeOnborda, startOnborda } = useOnborda();
// // To trigger a specific step
// setCurrentStep(2); // step 3
// // To close/start onboarding
// closeOnborda();
// startOnborda();
const OnbordaContext = createContext(undefined);
const useOnborda = () => {
    const context = useContext(OnbordaContext);
    if (context === undefined) {
        throw new Error("useOnborda must be used within an OnbordaProvider");
    }
    return context;
};
const OnbordaProvider = ({ children, tours = [], activeTour = null, }) => {
    const [currentTour, setCurrentTourState] = useState(null);
    const [currentStep, setCurrentStepState] = useState(0);
    const [isOnbordaVisible, setOnbordaVisible] = useState(false);
    const [currentTourSteps, setCurrentTourStepsState] = useState([]);
    const [completedSteps, setCompletedSteps] = useState(new Set());
    // Start the active tour on mount
    useEffect(() => {
        if (activeTour) {
            startOnborda(activeTour);
        }
    }, [activeTour]);
    const setCurrentStep = useCallback((step, delay) => {
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
        }
        else {
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
    const initializeCompletedSteps = useCallback(async (tourSteps) => {
        return Promise.all(tourSteps.map(async (step) => {
            return step.initialCompletedState ? step.initialCompletedState() : false;
        })).then((results) => {
            const firstIncomplete = results.findIndex((result) => !result);
            const completed = results.reduce((acc, result, index) => {
                if (result) {
                    acc.push(tourSteps[index]?.id || index);
                }
                return acc;
            }, []);
            setCompletedSteps(new Set(completed));
            // If all steps are completed, return the last step
            return firstIncomplete === -1 ? tourSteps.length - 1 : firstIncomplete;
        });
    }, []);
    const setCurrentTour = useCallback((tourName) => {
        if (!tourName) {
            closeOnborda();
            return;
        }
        setCurrentTourState(tourName);
        const tourSteps = tours.find((tour) => tour.tour === tourName)?.steps || [];
        setCurrentTourStepsState(tourSteps);
        initializeCompletedSteps(tourSteps).then(r => {
            setCurrentStep(r);
            setOnbordaVisible(true);
        });
    }, [tours]);
    const startOnborda = useCallback((tourName) => {
        setCurrentTour(tourName);
    }, [setCurrentTour]);
    return (_jsx(OnbordaContext.Provider, { value: {
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
        }, children: children }));
};
export { OnbordaProvider, useOnborda };
