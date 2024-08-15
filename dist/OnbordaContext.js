"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useCallback } from "react";
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
const OnbordaProvider = ({ children, }) => {
    const [currentTour, setCurrentTour] = useState(null);
    const [currentStep, setCurrentStepState] = useState(0);
    const [isOnbordaVisible, setOnbordaVisible] = useState(false);
    const setCurrentStep = useCallback((step, delay) => {
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
        setOnbordaVisible(false);
        setCurrentTour(null);
    }, []);
    const startOnborda = useCallback((tourName) => {
        setCurrentTour(tourName);
        setCurrentStepState(0);
        setOnbordaVisible(true);
    }, []);
    return (_jsx(OnbordaContext.Provider, { value: {
            currentTour,
            currentStep,
            setCurrentStep,
            closeOnborda,
            startOnborda,
            isOnbordaVisible,
        }, children: children }));
};
export { OnbordaProvider, useOnborda };
