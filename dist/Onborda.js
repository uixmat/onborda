"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { useOnborda } from "./OnbordaContext";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Portal } from "@radix-ui/react-portal";
import { getCardStyle, getArrowStyle } from "./OnbordaStyles";
/**
 * Onborda Component
 * @param {OnbordaProps} props
 * @constructor
 */
const Onborda = ({ children, shadowRgb = "0, 0, 0", shadowOpacity = "0.2", cardTransition = { ease: "anticipate", duration: 0.6 }, cardComponent: CardComponent, tourComponent: TourComponent, debug = false, observerTimeout = 5000, }) => {
    const { currentTour, currentStep, setCurrentStep, isOnbordaVisible, currentTourSteps } = useOnborda();
    const [elementToScroll, setElementToScroll] = useState(null);
    const [pointerPosition, setPointerPosition] = useState(null);
    const currentElementRef = useRef(null);
    const [canProceed, setCanProceed] = useState(true);
    const offset = 20;
    const hasSelector = (step) => {
        return !!step?.selector || !!step?.customQuerySelector;
    };
    const getStepSelectorElement = (step) => {
        return step?.selector ? document.querySelector(step.selector) : step?.customQuerySelector ? step.customQuerySelector() : null;
    };
    // - -
    // Route Changes
    const router = useRouter();
    // - -
    // Initialisze
    useEffect(() => {
        if (isOnbordaVisible && currentTourSteps) {
            debug && console.log("Onborda: Current Step Changed");
            const step = currentTourSteps[currentStep];
            if (step) {
                const element = getStepSelectorElement(step);
                if (element) {
                    setPointerPosition(getElementPosition(element));
                    setElementToScroll(element);
                    currentElementRef.current = element;
                    // Enable pointer events on the element
                    if (step.interactable) {
                        const htmlElement = element;
                        htmlElement.style.pointerEvents = "auto";
                    }
                }
                else {
                    // if the element is not found, place the pointer at the center of the screen
                    setPointerPosition({
                        x: window.innerWidth / 2,
                        y: window.innerHeight / 2,
                        width: 0,
                        height: 0,
                    });
                    setElementToScroll(null);
                    currentElementRef.current = null;
                }
                // Prefetch the next route
                const nextStep = currentTourSteps[currentStep + 1];
                if (nextStep && nextStep?.route) {
                    debug && console.log("Onborda: Prefetching Next Route", nextStep.route);
                    router.prefetch(nextStep.route);
                }
            }
        }
        return () => {
            // Disable pointer events on the element on cleanup
            if (currentElementRef.current) {
                const htmlElement = currentElementRef.current;
                htmlElement.style.pointerEvents = "";
            }
        };
    }, [currentStep, currentTourSteps, offset, isOnbordaVisible]);
    // Update the canProceed state based on the nextStepConditions
    useEffect(() => {
        const step = currentTourSteps?.[currentStep];
        const element = step ? getStepSelectorElement(step) : null;
        if (element && step?.nextStepConditions) {
            const handleInteraction = () => {
                const canProceed = step?.nextStepConditions?.(element) ?? true;
                setCanProceed(canProceed);
            };
            // Initial check
            handleInteraction();
            element.addEventListener("click", handleInteraction);
            element.addEventListener("input", handleInteraction);
            element.addEventListener("change", handleInteraction);
            return () => {
                // Cleanup the event listeners
                element.removeEventListener("click", handleInteraction);
                element.removeEventListener("input", handleInteraction);
                element.removeEventListener("change", handleInteraction);
            };
        }
        else {
            setCanProceed(true);
        }
    }, [currentStep, currentTourSteps]);
    // - -
    // Helper function to get element position
    const getElementPosition = (element) => {
        const { top, left, width, height } = element.getBoundingClientRect();
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
        return {
            x: left + scrollLeft,
            y: top + scrollTop,
            width,
            height,
        };
    };
    // - -
    // Scroll to the element when the elementToScroll changes
    useEffect(() => {
        if (elementToScroll && isOnbordaVisible) {
            debug && console.log("Onborda: Element to Scroll Changed");
            const rect = elementToScroll.getBoundingClientRect();
            const isAbove = rect.top < 0;
            elementToScroll.scrollIntoView({
                behavior: "smooth",
                block: isAbove ? "center" : "center",
                inline: "center",
            });
        }
    }, [elementToScroll, isOnbordaVisible]);
    // - -
    // Update pointer position on window resize
    const updatePointerPosition = () => {
        if (currentTourSteps) {
            const step = currentTourSteps[currentStep];
            if (step) {
                const element = getStepSelectorElement(step);
                if (element) {
                    setPointerPosition(getElementPosition(element));
                }
                else {
                    // if the element is not found, place the pointer at the center of the screen
                    setPointerPosition({
                        x: window.innerWidth / 2,
                        y: window.innerHeight / 2,
                        width: 0,
                        height: 0,
                    });
                    setElementToScroll(null);
                    currentElementRef.current = null;
                }
            }
        }
    };
    // - -
    // Update pointer position on window resize
    useEffect(() => {
        if (isOnbordaVisible) {
            window.addEventListener("resize", updatePointerPosition);
            return () => window.removeEventListener("resize", updatePointerPosition);
        }
    }, [currentStep, currentTourSteps, isOnbordaVisible]);
    // - -
    // Step Controls
    const nextStep = async () => {
        if (currentTourSteps && currentStep < currentTourSteps.length - 1) {
            try {
                const nextStepIndex = currentStep + 1;
                const route = currentTourSteps[nextStepIndex].route;
                // Check if the route is set and different from the current route
                if (route && currentTourSteps[currentStep].route !== route) {
                    // Trigger the next route
                    await router.push(route);
                    // Use MutationObserver to detect when the target element is available in the DOM
                    const observer = new MutationObserver((mutations, observer) => {
                        const shouldSelect = hasSelector(currentTourSteps[nextStepIndex]);
                        if (shouldSelect) {
                            const element = getStepSelectorElement(currentTourSteps[nextStepIndex]);
                            if (element) {
                                // Once the element is found, update the step and scroll to the element
                                setCurrentStep(nextStepIndex);
                                // Stop observing after the element is found
                                observer.disconnect();
                            }
                            else {
                                debug && console.log("Onborda: Observing for element...", currentTourSteps[nextStepIndex]);
                            }
                        }
                        else {
                            console.log("Onborda: No selector set for next step while observing", currentTourSteps[nextStepIndex]);
                            setCurrentStep(nextStepIndex);
                            observer.disconnect();
                        }
                    });
                    // Start observing the document body for changes
                    observer.observe(document.body, {
                        childList: true,
                        subtree: true,
                    });
                    // Set a timeout to disconnect the observer if the element is not found within a certain period
                    const timeoutId = setTimeout(() => {
                        observer.disconnect();
                        console.error("Onborda: Element not found within the timeout period");
                    }, observerTimeout); // Adjust the timeout period as needed
                    // Clear the timeout if the observer disconnects successfully
                    const originalDisconnect = observer.disconnect.bind(observer);
                    observer.disconnect = () => {
                        clearTimeout(timeoutId);
                        originalDisconnect();
                    };
                }
                else {
                    // If no route is set, update the step instantly
                    setCurrentStep(nextStepIndex);
                }
            }
            catch (error) {
                console.error("Error navigating to next route", error);
            }
        }
    };
    const prevStep = async () => {
        if (currentTourSteps && currentStep > 0) {
            try {
                const prevStepIndex = currentStep - 1;
                const route = currentTourSteps[prevStepIndex].route;
                // Check if the route is set and different from the current route
                if (route && currentTourSteps[currentStep].route !== route) {
                    // Trigger the previous route
                    await router.push(route);
                    // Use MutationObserver to detect when the target element is available in the DOM
                    const observer = new MutationObserver((mutations, observer) => {
                        const shouldSelect = hasSelector(currentTourSteps[prevStepIndex]);
                        if (shouldSelect) {
                            const element = getStepSelectorElement(currentTourSteps[prevStepIndex]);
                            if (element) {
                                // Once the element is found, update the step and scroll to the element
                                setCurrentStep(prevStepIndex);
                                // Stop observing after the element is found
                                observer.disconnect();
                            }
                            else {
                                // Continue observing until the element is found
                                debug && console.log("Onborda: Observing for element...", currentTourSteps[prevStepIndex]);
                            }
                        }
                        else {
                            debug && console.log("Onborda: No selector set for previous step while observing", currentTourSteps[prevStepIndex]);
                            setCurrentStep(prevStepIndex);
                            observer.disconnect();
                        }
                    });
                    // Start observing the document body for changes
                    observer.observe(document.body, {
                        childList: true,
                        subtree: true,
                    });
                    // Set a timeout to disconnect the observer if the element is not found within a certain period
                    const timeoutId = setTimeout(() => {
                        observer.disconnect();
                        console.error("Onborda: Element not found within the timeout period");
                    }, observerTimeout); // Adjust the timeout period as needed
                    // Clear the timeout if the observer disconnects successfully
                    const originalDisconnect = observer.disconnect.bind(observer);
                    observer.disconnect = () => {
                        clearTimeout(timeoutId);
                        originalDisconnect();
                    };
                }
                else {
                    // If no route is set, update the step instantly
                    setCurrentStep(prevStepIndex);
                }
            }
            catch (error) {
                console.error("Error navigating to previous route", error);
            }
        }
    };
    const setStep = async (step) => {
        if (currentTourSteps) {
            try {
                const setStepIndex = typeof step === 'string' ? currentTourSteps.findIndex((s) => s?.id === step) : step;
                const route = currentTourSteps[setStepIndex].route;
                // Check if the route is set and different from the current route
                if (route && currentTourSteps[currentStep].route !== route) {
                    // Trigger the next route
                    await router.push(route);
                    // Use MutationObserver to detect when the target element is available in the DOM
                    const observer = new MutationObserver((mutations, observer) => {
                        const shouldSelect = hasSelector(currentTourSteps[setStepIndex]);
                        if (shouldSelect) {
                            const element = getStepSelectorElement(currentTourSteps[setStepIndex]);
                            if (element) {
                                // Once the element is found, update the step and scroll to the element
                                setCurrentStep(setStepIndex);
                                // Stop observing after the element is found
                                observer.disconnect();
                            }
                            else {
                                debug && console.log("Onborda: Observing for element...", currentTourSteps[setStepIndex]);
                            }
                        }
                        else {
                            console.log("Onborda: No selector set for next step while observing", currentTourSteps[setStepIndex]);
                            setCurrentStep(setStepIndex);
                            observer.disconnect();
                        }
                    });
                    // Start observing the document body for changes
                    observer.observe(document.body, {
                        childList: true,
                        subtree: true,
                    });
                    // Set a timeout to disconnect the observer if the element is not found within a certain period
                    const timeoutId = setTimeout(() => {
                        observer.disconnect();
                        console.error("Onborda: Element not found within the timeout period");
                    }, observerTimeout); // Adjust the timeout period as needed
                    // Clear the timeout if the observer disconnects successfully
                    const originalDisconnect = observer.disconnect.bind(observer);
                    observer.disconnect = () => {
                        clearTimeout(timeoutId);
                        originalDisconnect();
                    };
                }
                else {
                    // If no route is set, update the step instantly
                    setCurrentStep(setStepIndex);
                }
            }
            catch (error) {
                console.error("Error navigating to next route", error);
            }
        }
    };
    // - -
    // Card Arrow
    const CardArrow = ({ isVisible }) => {
        if (!isVisible) {
            return null;
        }
        return (_jsx("svg", { viewBox: "0 0 54 54", "data-name": "onborda-arrow", className: "absolute w-6 h-6 origin-center", style: getArrowStyle(currentTourSteps?.[currentStep]?.side), children: _jsx("path", { id: "triangle", d: "M27 27L0 0V54L27 27Z", fill: "currentColor" }) }));
    };
    // - -
    // Overlay Variants
    const variants = {
        visible: { opacity: 1 },
        hidden: { opacity: 0 },
    };
    // - -
    // Pointer Options
    const pointerPadding = currentTourSteps?.[currentStep]?.pointerPadding ?? 30;
    const pointerPadOffset = pointerPadding / 2;
    const pointerRadius = currentTourSteps?.[currentStep]?.pointerRadius ?? 28;
    const pointerEvents = pointerPosition && isOnbordaVisible ? 'pointer-events-none' : '';
    return (_jsxs(_Fragment, { children: [_jsx("div", { "data-name": "onborda-site-wrapper", className: ` ${pointerEvents} `, children: children }), pointerPosition && isOnbordaVisible && CardComponent && (_jsxs(Portal, { children: [_jsx(motion.div, { "data-name": "onborda-overlay", className: "absolute inset-0 pointer-events-none z-[997]", initial: "hidden", animate: isOnbordaVisible ? "visible" : "hidden", variants: variants, transition: { duration: 0.5 }, children: _jsx(motion.div, { "data-name": "onborda-pointer", className: "relative z-[998]", style: {
                                boxShadow: `0 0 200vw 200vh rgba(${shadowRgb}, ${shadowOpacity})`,
                                borderRadius: `${pointerRadius}px ${pointerRadius}px ${pointerRadius}px ${pointerRadius}px`,
                            }, initial: pointerPosition
                                ? {
                                    x: pointerPosition.x - pointerPadOffset,
                                    y: pointerPosition.y - pointerPadOffset,
                                    width: pointerPosition.width + pointerPadding,
                                    height: pointerPosition.height + pointerPadding,
                                }
                                : {}, animate: pointerPosition
                                ? {
                                    x: pointerPosition.x - pointerPadOffset,
                                    y: pointerPosition.y - pointerPadOffset,
                                    width: pointerPosition.width + pointerPadding,
                                    height: pointerPosition.height + pointerPadding,
                                }
                                : {}, transition: cardTransition, children: _jsx("div", { className: "absolute flex flex-col max-w-[100%] transition-all min-w-min pointer-events-auto z-[999]", "data-name": "onborda-card", style: getCardStyle(currentTourSteps?.[currentStep]?.side), children: _jsx(CardComponent, { step: currentTourSteps?.[currentStep], currentStep: currentStep, totalSteps: currentTourSteps?.length ?? 0, nextStep: nextStep, prevStep: prevStep, setStep: setStep, arrow: _jsx(CardArrow, { isVisible: currentTourSteps?.[currentStep] ? hasSelector(currentTourSteps?.[currentStep]) : false }), canProceed: canProceed }) }) }) }), TourComponent && currentTourSteps && (_jsx(motion.div, { "data-name": 'onborda-tour-wrapper', className: 'fixed top-0 left-0 z-[998] w-screen h-screen pointer-events-none', children: _jsx(motion.div, { "data-name": 'onborda-tour', className: 'pointer-events-auto', children: _jsx(TourComponent, { steps: currentTourSteps, currentTour: currentTour, currentStep: currentStep, setStep: setStep }) }) }))] }))] }));
};
export default Onborda;
