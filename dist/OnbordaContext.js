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
const OnbordaProvider = ({ children, tours = [], }) => {
    const [currentTour, setCurrentTour] = useState(null);
    const [currentStep, setCurrentStepState] = useState(0);
    const [isOnbordaVisible, setOnbordaVisible] = useState(false);
    const [currentTourSteps, setCurrentTourSteps] = useState([]);
    const setCurrentStep = useCallback((step, delay) => {
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
        setCurrentTourSteps(tours.find((tour) => tour.tour === tourName)?.steps || []);
        setOnbordaVisible(true);
    }, []);
    return (_jsx(OnbordaContext.Provider, { value: {
            currentTour,
            currentStep,
            currentTourSteps,
            setCurrentStep,
            closeOnborda,
            startOnborda,
            isOnbordaVisible,
        }, children: children }));
};
export { OnbordaProvider, useOnborda };
