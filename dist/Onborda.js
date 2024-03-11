"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { useOnborda } from "./OnbordaContext";
import { motion, useInView } from "framer-motion";
import { useRouter, useParams, usePathname } from "next/navigation";
const Onborda = ({ children, steps, shadowRgb = "0, 0, 0", shadowOpacity = "0.2", cardComponent: CardComponent, }) => {
    const { currentStep, setCurrentStep, isOnbordaVisible } = useOnborda();
    const [elementToScroll, setElementToScroll] = useState(null);
    const [pointerPosition, setPointerPosition] = useState(null);
    const currentElementRef = useRef(null);
    const observeRef = useRef(null); // Ref for the observer element
    const isInView = useInView(observeRef);
    const params = useParams();
    const offset = 20;
    // - -
    // Route Changes
    const router = useRouter();
    const pathname = usePathname();
    // - -
    // Initialisze
    useEffect(() => {
        if (isOnbordaVisible) {
            console.log("Onborda: Initialising...");
            if (params.step) {
                setCurrentStep(parseInt(params.step));
            }
            if (steps.length > 0) {
                const firstStepElement = document.querySelector(steps[0].selector);
                if (firstStepElement) {
                    setPointerPosition(getElementPosition(firstStepElement));
                }
            }
        }
    }, [params.step, steps, isOnbordaVisible]);
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
        if (isOnbordaVisible) {
            console.log("Onborda: Current Step Changed");
            const step = steps[currentStep];
            if (step) {
                const element = document.querySelector(step.selector);
                if (element) {
                    setPointerPosition(getElementPosition(element));
                    currentElementRef.current = element; // Set the current element reference
                    setElementToScroll(element); // Set the element to be scrolled into view
                    const rect = element.getBoundingClientRect();
                    // Determine if the element is within the viewport + offset
                    const isInViewportWithOffset = rect.top >= -offset && rect.bottom <= window.innerHeight + offset;
                    if (!isInView || !isInViewportWithOffset) {
                        element.scrollIntoView({ behavior: "smooth", block: "center" });
                    }
                }
            }
        }
    }, [currentStep, steps, isInView, offset, isOnbordaVisible]);
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
        const step = steps[currentStep];
        if (step) {
            const element = document.querySelector(step.selector);
            if (element) {
                setPointerPosition(getElementPosition(element));
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
    }, [currentStep, steps, isOnbordaVisible]);
    // - -
    // Step Controls
    const nextStep = async () => {
        if (currentStep < steps.length - 1) {
            try {
                const nextStepIndex = currentStep + 1;
                const route = steps[currentStep].nextRoute; // Get nextRoute from the current step
                if (route) {
                    await router.push(route);
                    setTimeout(() => {
                        setCurrentStep(nextStepIndex);
                        scrollToElement(nextStepIndex);
                    }, 500); // Delay only if there's a route change
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
        if (currentStep > 0) {
            try {
                const prevStepIndex = currentStep - 1;
                const route = steps[currentStep].prevRoute; // Get prevRoute from the current step
                if (route) {
                    await router.push(`${route}?step=${prevStepIndex}`);
                    setTimeout(() => {
                        setCurrentStep(prevStepIndex);
                        scrollToElement(prevStepIndex);
                    }, 500); // Delay only if there's a route change
                    router.replace(route); // Clean up the URL
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
    const scrollToElement = (stepIndex) => {
        const element = document.querySelector(steps[stepIndex].selector);
        if (element) {
            const { top } = element.getBoundingClientRect();
            const isInViewport = top >= -offset && top <= window.innerHeight + offset;
            if (!isInViewport) {
                element.scrollIntoView({ behavior: "smooth", block: "center" });
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
            default:
                return {}; // Default case if no side is specified
        }
    };
    // - -
    // Card Arrow
    const CardArrow = () => {
        return (_jsx("svg", { viewBox: "0 0 54 54", "data-name": "onborda-arrow", className: "absolute w-6 h-6 origin-center", style: getArrowStyle(steps[currentStep]?.side), children: _jsx("path", { id: "triangle", d: "M27 27L0 0V54L27 27Z", fill: "currentColor" }) }));
    };
    // - -
    // Overlay Variants
    const variants = {
        visible: { opacity: 1 },
        hidden: { opacity: 0 },
    };
    // - -
    // Pointer Options
    const pointerPadding = steps[currentStep]?.pointerPadding ?? 30;
    const pointerPadOffset = pointerPadding / 2;
    const pointerRadius = steps[currentStep]?.pointerRadius ?? 28;
    // - -
    // Default Card
    const DefaultCard = ({ currentStep, nextStep, prevStep, arrow, }) => {
        return (_jsxs("div", { className: "flex flex-col w-full bg-white p-4 rounded-md text-black", children: [_jsxs("div", { className: "flex items-center justify-between gap-5 mb-3", children: [_jsxs("h2", { className: "text-xl font-bold", children: [steps[currentStep]?.icon, " ", steps[currentStep]?.title] }), _jsxs("div", { className: "text-slate-300 text-base font-semibold", children: [currentStep + 1, " of ", steps.length] })] }), _jsx("div", { "data-name": "onborda-stepper", className: "flex w-full gap-1 mb-8", children: steps.map((_, index) => (_jsx("span", { "data-name": "onborda-step", className: `self-stretch w-full h-1 rounded-xl ${index === currentStep ? "bg-indigo-600" : "bg-indigo-100"}` }, index))) }), _jsx("div", { className: "text-[15px]", children: steps[currentStep]?.content }), steps[currentStep]?.showControls && (_jsxs("div", { className: "flex items-center w-full gap-4 mt-4", children: [_jsx("button", { "data-control": "prev", onClick: prevStep, className: "rounded-sm px-5 py-3 outline-none inline-flex items-center text-white bg-indigo-600 hover:bg-indigo-700", children: "Prev" }), _jsx("button", { "data-control": "next", onClick: nextStep, className: "rounded-sm px-5 py-3 outline-none inline-flex items-center text-white bg-indigo-600 hover:bg-indigo-700 ml-auto", children: "Next" })] })), _jsx("span", { className: "text-white", children: arrow })] }));
    };
    const CardToRender = CardComponent
        ? () => (_jsx(CardComponent, { step: steps[currentStep], currentStep: currentStep, totalSteps: steps.length, nextStep: nextStep, prevStep: prevStep, arrow: _jsx(CardArrow, {}) }))
        : () => (_jsx(DefaultCard, { step: steps[currentStep], currentStep: currentStep, totalSteps: steps.length, nextStep: nextStep, prevStep: prevStep, arrow: _jsx(CardArrow, {}) }));
    return (_jsxs("div", { "data-name": "onborda-wrapper", className: "relative w-full", "data-onborda": "dev", children: [_jsx("div", { "data-name": "onborda-site", className: "relative block w-full", children: children }), pointerPosition && isOnbordaVisible && (_jsx(motion.div, { "data-name": "onborda-overlay", className: "absolute inset-0 z-[995] pointer-events-none", initial: "hidden", animate: isOnbordaVisible ? "visible" : "hidden", variants: variants, transition: { duration: 0.5 }, children: _jsx(motion.div, { "data-name": "onborda-pointer", className: "relative z-[999]", style: {
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
                        : {}, transition: { ease: "anticipate", duration: 0.6 }, children: _jsx("div", { className: "absolute flex flex-col w-[400px] transition-all min-w-min pointer-events-auto", "data-name": "onborda-card", style: getCardStyle(steps[currentStep]?.side), children: _jsx(CardToRender, {}) }) }) }))] }));
};
export default Onborda;
