"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { useOnborda } from "./OnbordaContext";
import { motion, useInView } from "framer-motion";
import { useRouter } from "next/navigation";
import { Portal } from "@radix-ui/react-portal";
const Onborda = ({ children, steps, shadowRgb = "0, 0, 0", shadowOpacity = "0.2", cardTransition = { ease: "anticipate", duration: 0.6 }, cardComponent: CardComponent, }) => {
    const { currentTour, currentStep, setCurrentStep, isOnbordaVisible } = useOnborda();
    const currentTourSteps = steps.find((tour) => tour.tour === currentTour)?.steps;
    const [elementToScroll, setElementToScroll] = useState(null);
    const [pointerPosition, setPointerPosition] = useState(null);
    const currentElementRef = useRef(null);
    const observeRef = useRef(null); // Ref for the observer element
    const isInView = useInView(observeRef);
    const offset = 20;
    // - -
    // Route Changes
    const router = useRouter();
    // - -
    // Initialisze
    useEffect(() => {
        if (isOnbordaVisible && currentTourSteps) {
            console.log("Onborda: Current Step Changed");
            const step = currentTourSteps[currentStep];
            if (step) {
                const element = document.querySelector(step.selector);
                if (element) {
                    setPointerPosition(getElementPosition(element));
                    currentElementRef.current = element;
                    setElementToScroll(element);
                    const rect = element.getBoundingClientRect();
                    const isInViewportWithOffset = rect.top >= -offset && rect.bottom <= window.innerHeight + offset;
                    if (!isInView || !isInViewportWithOffset) {
                        element.scrollIntoView({ behavior: "smooth", block: "center" });
                    }
                }
            }
        }
    }, [currentStep, currentTourSteps, isInView, offset, isOnbordaVisible]);
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
    // Update pointerPosition when currentStep changes
    useEffect(() => {
        if (isOnbordaVisible && currentTourSteps) {
            console.log("Onborda: Current Step Changed");
            const step = currentTourSteps[currentStep];
            if (step) {
                const element = document.querySelector(step.selector);
                if (element) {
                    setPointerPosition(getElementPosition(element));
                    currentElementRef.current = element;
                    setElementToScroll(element);
                    const rect = element.getBoundingClientRect();
                    const isInViewportWithOffset = rect.top >= -offset && rect.bottom <= window.innerHeight + offset;
                    if (!isInView || !isInViewportWithOffset) {
                        element.scrollIntoView({ behavior: "smooth", block: "center" });
                    }
                }
            }
        }
    }, [currentStep, currentTourSteps, isInView, offset, isOnbordaVisible]);
    useEffect(() => {
        if (elementToScroll && !isInView && isOnbordaVisible) {
            console.log("Onborda: Element to Scroll Changed");
            const rect = elementToScroll.getBoundingClientRect();
            const isAbove = rect.top < 0;
            elementToScroll.scrollIntoView({
                behavior: "smooth",
                block: isAbove ? "center" : "center",
                inline: "center",
            });
        }
    }, [elementToScroll, isInView, isOnbordaVisible]);
    // - -
    // Update pointer position on window resize
    const updatePointerPosition = () => {
        if (currentTourSteps) {
            const step = currentTourSteps[currentStep];
            if (step) {
                const element = document.querySelector(step.selector);
                if (element) {
                    setPointerPosition(getElementPosition(element));
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
                const route = currentTourSteps[currentStep].nextRoute;
                if (route) {
                    await router.push(route);
                    const targetSelector = currentTourSteps[nextStepIndex].selector;
                    // Use MutationObserver to detect when the target element is available in the DOM
                    const observer = new MutationObserver((mutations, observer) => {
                        const element = document.querySelector(targetSelector);
                        if (element) {
                            // Once the element is found, update the step and scroll to the element
                            setCurrentStep(nextStepIndex);
                            scrollToElement(nextStepIndex);
                            // Stop observing after the element is found
                            observer.disconnect();
                        }
                    });
                    // Start observing the document body for changes
                    observer.observe(document.body, {
                        childList: true,
                        subtree: true,
                    });
                }
                else {
                    setCurrentStep(nextStepIndex);
                    scrollToElement(nextStepIndex);
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
                const route = currentTourSteps[currentStep].prevRoute;
                if (route) {
                    await router.push(route);
                    const targetSelector = currentTourSteps[prevStepIndex].selector;
                    // Use MutationObserver to detect when the target element is available in the DOM
                    const observer = new MutationObserver((mutations, observer) => {
                        const element = document.querySelector(targetSelector);
                        if (element) {
                            // Once the element is found, update the step and scroll to the element
                            setCurrentStep(prevStepIndex);
                            scrollToElement(prevStepIndex);
                            // Stop observing after the element is found
                            observer.disconnect();
                        }
                    });
                    // Start observing the document body for changes
                    observer.observe(document.body, {
                        childList: true,
                        subtree: true,
                    });
                }
                else {
                    setCurrentStep(prevStepIndex);
                    scrollToElement(prevStepIndex);
                }
            }
            catch (error) {
                console.error("Error navigating to previous route", error);
            }
        }
    };
    // - -
    // Scroll to the correct element when the step changes
    const scrollToElement = (stepIndex) => {
        if (currentTourSteps) {
            const element = document.querySelector(currentTourSteps[stepIndex].selector);
            if (element) {
                const { top } = element.getBoundingClientRect();
                const isInViewport = top >= -offset && top <= window.innerHeight + offset;
                if (!isInViewport) {
                    element.scrollIntoView({ behavior: "smooth", block: "center" });
                }
                // Update pointer position after scrolling
                setPointerPosition(getElementPosition(element));
            }
        }
    };
    // - -
    // Card Side
    const getCardStyle = (side) => {
        switch (side) {
            case "top":
                return {
                    transform: `translate(-50%, 0)`,
                    left: "50%",
                    bottom: "100%",
                    marginBottom: "25px",
                };
            case "bottom":
                return {
                    transform: `translate(-50%, 0)`,
                    left: "50%",
                    top: "100%",
                    marginTop: "25px",
                };
            case "left":
                return {
                    transform: `translate(0, -50%)`,
                    right: "100%",
                    top: "50%",
                    marginRight: "25px",
                };
            case "right":
                return {
                    transform: `translate(0, -50%)`,
                    left: "100%",
                    top: "50%",
                    marginLeft: "25px",
                };
            case "top-left":
                return {
                    bottom: "100%",
                    marginBottom: "25px",
                };
            case "top-right":
                return {
                    right: 0,
                    bottom: "100%",
                    marginBottom: "25px",
                };
            case "bottom-left":
                return {
                    top: "100%",
                    marginTop: "25px",
                };
            case "bottom-right":
                return {
                    right: 0,
                    top: "100%",
                    marginTop: "25px",
                };
            case "right-bottom":
                return {
                    left: "100%",
                    bottom: 0,
                    marginLeft: "25px",
                };
            case "right-top":
                return {
                    left: "100%",
                    top: 0,
                    marginLeft: "25px",
                };
            case "left-bottom":
                return {
                    right: "100%",
                    bottom: 0,
                    marginRight: "25px",
                };
            case "left-top":
                return {
                    right: "100%",
                    top: 0,
                    marginRight: "25px",
                };
            default:
                return {}; // Default case if no side is specified
        }
    };
    // - -
    // Arrow position based on card side
    const getArrowStyle = (side) => {
        switch (side) {
            case "bottom":
                return {
                    transform: `translate(-50%, 0) rotate(270deg)`,
                    left: "50%",
                    top: "-23px",
                };
            case "top":
                return {
                    transform: `translate(-50%, 0) rotate(90deg)`,
                    left: "50%",
                    bottom: "-23px",
                };
            case "right":
                return {
                    transform: `translate(0, -50%) rotate(180deg)`,
                    top: "50%",
                    left: "-23px",
                };
            case "left":
                return {
                    transform: `translate(0, -50%) rotate(0deg)`,
                    top: "50%",
                    right: "-23px",
                };
            case "top-left":
                return {
                    transform: `rotate(90deg)`,
                    left: "10px",
                    bottom: "-23px",
                };
            case "top-right":
                return {
                    transform: `rotate(90deg)`,
                    right: "10px",
                    bottom: "-23px",
                };
            case "bottom-left":
                return {
                    transform: `rotate(270deg)`,
                    left: "10px",
                    top: "-23px",
                };
            case "bottom-right":
                return {
                    transform: `rotate(270deg)`,
                    right: "10px",
                    top: "-23px",
                };
            case "right-bottom":
                return {
                    transform: `rotate(180deg)`,
                    left: "-23px",
                    bottom: "10px",
                };
            case "right-top":
                return {
                    transform: `rotate(180deg)`,
                    left: "-23px",
                    top: "10px",
                };
            case "left-bottom":
                return {
                    transform: `rotate(0deg)`,
                    right: "-23px",
                    bottom: "10px",
                };
            case "left-top":
                return {
                    transform: `rotate(0deg)`,
                    right: "-23px",
                    top: "10px",
                };
            default:
                return {}; // Default case if no side is specified
        }
    };
    // - -
    // Card Arrow
    const CardArrow = () => {
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
    return (_jsxs("div", { "data-name": "onborda-wrapper", className: "relative w-full", "data-onborda": "dev", children: [_jsx("div", { "data-name": "onborda-site", className: "block w-full", children: children }), pointerPosition && isOnbordaVisible && CardComponent && (_jsx(Portal, { children: _jsx(motion.div, { "data-name": "onborda-overlay", className: "absolute inset-0 ", initial: "hidden", animate: isOnbordaVisible ? "visible" : "hidden", variants: variants, transition: { duration: 0.5 }, children: _jsx(motion.div, { "data-name": "onborda-pointer", className: "relative z-[999]", style: {
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
                            : {}, transition: cardTransition, children: _jsx("div", { className: "absolute flex flex-col max-w-[100%] transition-all min-w-min pointer-events-auto z-[999]", "data-name": "onborda-card", style: getCardStyle(currentTourSteps?.[currentStep]?.side), children: _jsx(CardComponent, { step: currentTourSteps?.[currentStep], currentStep: currentStep, totalSteps: currentTourSteps?.length ?? 0, nextStep: nextStep, prevStep: prevStep, arrow: _jsx(CardArrow, {}) }) }) }) }) }))] }));
};
export default Onborda;
