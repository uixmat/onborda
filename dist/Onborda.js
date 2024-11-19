"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useRef, useState } from "react";
import { useOnborda } from "./OnbordaContext";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { Portal } from "@radix-ui/react-portal";
import { getCardStyle, getArrowStyle } from "./OnbordaStyles";
/**
 * Onborda Component
 * @param {OnbordaProps} props
 * @constructor
 */
const Onborda = ({ children, shadowRgb = "0, 0, 0", shadowOpacity = "0.2", cardTransition = { ease: "anticipate", duration: 0.6 }, cardComponent: CardComponent, tourComponent: TourComponent, debug = false, observerTimeout = 5000, }) => {
    const { currentTour, currentStep, setCurrentStep, isOnbordaVisible, currentTourSteps, completedSteps, setCompletedSteps, tours, closeOnborda } = useOnborda();
    const [elementToScroll, setElementToScroll] = useState(null);
    const [pointerPosition, setPointerPosition] = useState(null);
    const currentElementRef = useRef(null);
    const [currentRoute, setCurrentRoute] = useState(null);
    const hasSelector = (step) => {
        return !!step?.selector || !!step?.customQuerySelector;
    };
    const getStepSelectorElement = (step) => {
        return step?.selector ? document.querySelector(step.selector) : step?.customQuerySelector ? step.customQuerySelector() : null;
    };
    // Get the current tour object
    const currentTourObject = useMemo(() => {
        return tours.find((tour) => tour.tour === currentTour);
    }, [currentTour, isOnbordaVisible]);
    // - -
    // Route Changes
    const router = useRouter();
    const path = usePathname();
    // Update the current route on route changes
    useEffect(() => {
        setCurrentRoute(path);
    }, [path]);
    // - -
    // Initialisze
    useEffect(() => {
        let cleanup = [];
        if (isOnbordaVisible && currentTourSteps) {
            debug && console.log("Onborda: Current Step Changed", currentStep);
            const step = currentTourSteps[currentStep];
            if (step) {
                let elementFound = false;
                // Check if the step has a selector
                if (hasSelector(step)) {
                    // This step has a selector. Lets find the element
                    const element = getStepSelectorElement(step);
                    // Check if the element is found
                    if (element) {
                        // Once the element is found, update the step and scroll to the element
                        setPointerPosition(getElementPosition(element));
                        setElementToScroll(element);
                        currentElementRef.current = element;
                        // Function to mark the step as completed if the conditions are met
                        const handleInteraction = () => {
                            const isComplete = step?.isCompleteConditions?.(element) ?? true;
                            debug && console.log("Onborda: Step Interaction", step, isComplete);
                            // Check if the step is complete based on the conditions, and not already marked as completed
                            if (isComplete && !Array.from(completedSteps).includes(step?.id ?? currentStep)) {
                                debug && console.log("Onborda: Step Completed", step);
                                setCompletedSteps((prev) => {
                                    return prev.add(step?.id ?? currentStep);
                                });
                                // If callback is provided, call it
                                step?.onComplete && step.onComplete();
                            } // Check if the step is incomplete based on the conditions, and already marked as completed
                            else if (!isComplete && Array.from(completedSteps).includes(step?.id ?? currentStep)) {
                                debug && console.log("Onborda: Step Incomplete", step);
                                setCompletedSteps((prev) => {
                                    prev.delete(step?.id ?? currentStep);
                                    return prev;
                                });
                            }
                        };
                        // Initial check
                        handleInteraction();
                        // Enable pointer events on the element
                        if (step.interactable) {
                            const htmlElement = element;
                            htmlElement.style.pointerEvents = "auto";
                            // Add event listeners if the step is interactable and has conditions
                            if (step?.isCompleteConditions) {
                                element.addEventListener("click", handleInteraction);
                                element.addEventListener("input", handleInteraction);
                                element.addEventListener("change", handleInteraction);
                                debug && console.log("Onborda: Added event listeners for element", element);
                                cleanup.push(() => {
                                    // Cleanup the event listeners
                                    element.removeEventListener("click", handleInteraction);
                                    element.removeEventListener("input", handleInteraction);
                                    element.removeEventListener("change", handleInteraction);
                                    debug && console.log("Onborda: Removed event listeners for element", element);
                                });
                            }
                        }
                        elementFound = true;
                    }
                    // Even if the element is already found, we still need to check if the route is different from the current route
                    // do we have a route to navigate to?
                    if (step.route) {
                        // Check if the route is set and different from the current route
                        if (currentRoute == null || !currentRoute?.endsWith(step.route)) {
                            debug && console.log("Onborda: Navigating to route", step.route);
                            // Trigger the next route
                            router.push(step.route);
                            // Use MutationObserver to detect when the target element is available in the DOM
                            const observer = new MutationObserver((mutations, observer) => {
                                const shouldSelect = hasSelector(currentTourSteps[currentStep]);
                                if (shouldSelect) {
                                    const element = getStepSelectorElement(currentTourSteps[currentStep]);
                                    if (element) {
                                        // Once the element is found, update the step and scroll to the element
                                        setPointerPosition(getElementPosition(element));
                                        setElementToScroll(element);
                                        currentElementRef.current = element;
                                        const handleInteraction = () => {
                                            const isComplete = step?.isCompleteConditions?.(element) ?? true;
                                            debug && console.log("Onborda: Step Interaction", step, isComplete);
                                            // Check if the step is complete based on the conditions, and not already marked as completed
                                            if (isComplete && !Array.from(completedSteps).includes(step?.id ?? currentStep)) {
                                                debug && console.log("Onborda: Step Completed", step);
                                                setCompletedSteps((prev) => {
                                                    return prev.add(step?.id ?? currentStep);
                                                });
                                                // If callback is provided, call it
                                                step?.onComplete && step.onComplete();
                                            } // Check if the step is incomplete based on the conditions, and already marked as completed
                                            else if (!isComplete && Array.from(completedSteps).includes(step?.id ?? currentStep)) {
                                                debug && console.log("Onborda: Step Incomplete", step);
                                                setCompletedSteps((prev) => {
                                                    prev.delete(step?.id ?? currentStep);
                                                    return prev;
                                                });
                                            }
                                        };
                                        // Initial check
                                        handleInteraction();
                                        // Enable pointer events on the element
                                        if (step.interactable) {
                                            const htmlElement = element;
                                            htmlElement.style.pointerEvents = "auto";
                                        }
                                        // Stop observing after the element is found
                                        observer.disconnect();
                                        debug && console.log("Onborda: Observer disconnected after element found", element);
                                    }
                                    else {
                                        debug && console.log("Onborda: Observing for element...", currentTourSteps[currentStep]);
                                    }
                                }
                                else {
                                    setCurrentStep(currentStep);
                                    observer.disconnect();
                                    debug && console.log("Onborda: Observer disconnected after no selector set", currentTourSteps[currentStep]);
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
                                console.error("Onborda: Observer Timeout", currentTourSteps[currentStep]);
                            }, observerTimeout); // Adjust the timeout period as needed
                            // Clear the timeout if the observer disconnects successfully
                            const originalDisconnect = observer.disconnect.bind(observer);
                            observer.disconnect = () => {
                                clearTimeout(timeoutId);
                                originalDisconnect();
                            };
                        }
                    }
                }
                else {
                    // no selector, but might still need to navigate to a route
                    if (step.route) {
                        // Check if the route is set and different from the current route
                        if (currentRoute == null || !currentRoute?.endsWith(step.route)) {
                            debug && console.log("Onborda: Navigating to route", step.route);
                            // Trigger the next route
                            router.push(step.route);
                        }
                        else {
                            // Mark the step as completed
                            step?.onComplete && step.onComplete();
                            setCompletedSteps((prev) => {
                                return prev.add(step?.id ?? currentStep);
                            });
                        }
                    }
                    else {
                        // Mark the step as completed
                        step?.onComplete && step.onComplete();
                        setCompletedSteps((prev) => {
                            return prev.add(step?.id ?? currentStep);
                        });
                    }
                }
                // No element set for this step? Place the pointer at the center of the screen
                if (!elementFound) {
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
            // Cleanup any event listeners we may have added
            cleanup.forEach(fn => fn());
        };
    }, [
        currentStep, // Re-run the effect when the current step changes
        currentTourSteps, // Re-run the effect when the current tour steps change
        isOnbordaVisible, // Re-run the effect when the onborda visibility changes
        currentRoute, // Re-run the effect when the current route changes
    ]);
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
        const nextStepIndex = currentStep + 1;
        await setStep(nextStepIndex);
    };
    const prevStep = async () => {
        const prevStepIndex = currentStep - 1;
        await setStep(prevStepIndex);
    };
    const setStep = async (step) => {
        const setStepIndex = typeof step === 'string' ? currentTourSteps.findIndex((s) => s?.id === step) : step;
        setCurrentStep(setStepIndex);
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
                                : {}, transition: cardTransition, children: _jsx("div", { className: "absolute flex flex-col max-w-[100%] transition-all min-w-min pointer-events-auto z-[999]", "data-name": "onborda-card", style: getCardStyle(currentTourSteps?.[currentStep]?.side), children: _jsx(CardComponent, { step: currentTourSteps?.[currentStep], currentStep: currentStep, totalSteps: currentTourSteps?.length ?? 0, nextStep: nextStep, prevStep: prevStep, setStep: setStep, arrow: _jsx(CardArrow, { isVisible: currentTourSteps?.[currentStep] ? hasSelector(currentTourSteps?.[currentStep]) : false }), completedSteps: Array.from(completedSteps) }) }) }) }), TourComponent && currentTourObject !== undefined && (_jsx(motion.div, { "data-name": 'onborda-tour-wrapper', className: 'fixed top-0 left-0 z-[998] w-screen h-screen pointer-events-none', children: _jsx(motion.div, { "data-name": 'onborda-tour', className: 'pointer-events-auto', children: _jsx(TourComponent, { tour: currentTourObject, currentTour: currentTour, currentStep: currentStep, setStep: setStep, completedSteps: Array.from(completedSteps), closeOnborda: closeOnborda }) }) }))] }))] }));
};
export default Onborda;
