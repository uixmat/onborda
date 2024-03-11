"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useCallback } from "react";
// Example Hooks Usage:
// const { setCurrentStep, closeOnborda, startOnborda } = useOnborda();
// // To trigger a specific step
// setCurrentStep(2); // Opens the onboarding overlay and goes to step 3
// // To close the onboarding
// closeOnborda(); // Closes the onboarding overlay
const OnbordaContext = createContext(undefined);
const useOnborda = () => {
    const context = useContext(OnbordaContext);
    if (context === undefined) {
        throw new Error("useOnborda must be used within an OnbordaProvider");
    }
    return context;
};
const OnbordaProvider = ({ children, }) => {
    const [currentStep, setCurrentStepState] = useState(0);
    const [isOnbordaVisible, setOnbordaVisible] = useState(true);
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
    }, []);
    const startOnborda = useCallback(() => {
        setOnbordaVisible(true);
    }, []);
    return (_jsx(OnbordaContext.Provider, { value: {
            currentStep,
            setCurrentStep,
            closeOnborda,
            startOnborda,
            isOnbordaVisible,
        }, children: children }));
};
export { OnbordaProvider, useOnborda };
