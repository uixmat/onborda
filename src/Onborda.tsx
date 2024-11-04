"use client";
import React, {useEffect, useRef, useState} from "react";
import {useOnborda} from "./OnbordaContext";
import {motion, useInView} from "framer-motion";
import {useRouter} from "next/navigation";
import {Portal} from "@radix-ui/react-portal";

// Types
import {OnbordaProps, Step} from "./types";
import {step} from "next/dist/experimental/testmode/playwright/step";

const Onborda: React.FC<OnbordaProps> = ({
    children,
    steps,
    shadowRgb = "0, 0, 0",
    shadowOpacity = "0.2",
    cardTransition = {ease: "anticipate", duration: 0.6},
    cardComponent: CardComponent,
    tourComponent: TourComponent,
}) => {
    const {currentTour, currentStep, setCurrentStep, isOnbordaVisible} =
        useOnborda();
    const currentTourSteps = steps.find(
        (tour) => tour.tour === currentTour
    )?.steps;

    const [elementToScroll, setElementToScroll] = useState<Element | null>(null);
    const [pointerPosition, setPointerPosition] = useState<{
        x: number;
        y: number;
        width: number;
        height: number;
    } | null>(null);
    const currentElementRef = useRef<Element | null>(null);
    const observeRef = useRef(null); // Ref for the observer element
    const isInView = useInView(observeRef);
    const offset = 20;

    const hasSelector = (step: Step): boolean => {
        return !!step?.selector || !!step?.customQuerySelector;
    }
    const getStepSelectorElement = (step: Step): Element | null => {
        return step?.selector ? document.querySelector(step.selector) : step?.customQuerySelector ? step.customQuerySelector() : null;
    }

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
                const element = getStepSelectorElement(step)
                if (element) {
                    setPointerPosition(getElementPosition(element));
                    currentElementRef.current = element;

                    // Enable pointer events on the element
                    if (step.interactable) {
                        const htmlElement = element as HTMLElement;
                        htmlElement.style.pointerEvents = "auto";
                    }

                    setElementToScroll(element);

                    const rect = element.getBoundingClientRect();
                    const isInViewportWithOffset =
                        rect.top >= -offset && rect.bottom <= window.innerHeight + offset;

                    if (!isInView || !isInViewportWithOffset) {
                        element.scrollIntoView({behavior: "smooth", block: "center"});
                    }
                }else {
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
        return () => {
            // Disable pointer events on the element on cleanup
            if (currentElementRef.current) {
                const htmlElement = currentElementRef.current as HTMLElement;
                htmlElement.style.pointerEvents = "";
            }
        }
    }, [currentStep, currentTourSteps, isInView, offset, isOnbordaVisible]);

    // - -
    // Helper function to get element position
    const getElementPosition = (element: Element) => {
        const {top, left, width, height} = element.getBoundingClientRect();
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
            const step = currentTourSteps[currentStep];
            console.log("Onborda: Current Step Changed", step);
            if (step) {
                const element = getStepSelectorElement(step);
                if (element) {
                    if (element) {
                        setPointerPosition(getElementPosition(element));
                        currentElementRef.current = element;
                        setElementToScroll(element);

                        const rect = element.getBoundingClientRect();
                        const isInViewportWithOffset =
                            rect.top >= -offset && rect.bottom <= window.innerHeight + offset;

                        if (!isInView || !isInViewportWithOffset) {
                            element.scrollIntoView({behavior: "smooth", block: "center"});
                        }
                    }
                }else {
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
                const element = getStepSelectorElement(step);
                if (element) {
                    setPointerPosition(getElementPosition(element));
                } else {
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
                const route = currentTourSteps[currentStep].nextRoute;

                if (route) {
                    await router.push(route);

                    const element = getStepSelectorElement(currentTourSteps[nextStepIndex]);
                    if (element) {
                        // Use MutationObserver to detect when the target element is available in the DOM
                        const observer = new MutationObserver((mutations, observer) => {
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
                    } else {
                        // If no selector is provided, just update the step
                        setCurrentStep(nextStepIndex);
                    }
                } else {
                    setCurrentStep(nextStepIndex);
                    scrollToElement(nextStepIndex);
                }
            } catch (error) {
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

                    const element = getStepSelectorElement(currentTourSteps[prevStepIndex]);
                    if (element) {
                        // Use MutationObserver to detect when the target element is available in the DOM
                        const observer = new MutationObserver((mutations, observer) => {
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
                    } else {
                        // If no selector is provided, just update the step
                        setCurrentStep(prevStepIndex);
                    }
                } else {
                    setCurrentStep(prevStepIndex);
                    scrollToElement(prevStepIndex);
                }
            } catch (error) {
                console.error("Error navigating to previous route", error);
            }
        }
    };

    // - -
    // Scroll to the correct element when the step changes
    const scrollToElement = (stepIndex: number) => {
        if (currentTourSteps) {
            const element = getStepSelectorElement(currentTourSteps[stepIndex]);
            if (element) {
                const {top} = element.getBoundingClientRect();
                const isInViewport = top >= -offset && top <= window.innerHeight + offset;
                if (!isInViewport) {
                    element.scrollIntoView({behavior: "smooth", block: "center"});
                }
                // Update pointer position after scrolling
                setPointerPosition(getElementPosition(element));
            } else {
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
    };

    // - -
    // Card Side
    const getCardStyle: (side: string) => React.CSSProperties = (side: string) => {
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
                // Default case if no side is specified. Center the card to the screen
                return {
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)', // Center the card
                    position: 'fixed', // Make sure it's positioned relative to the viewport
                    margin: '0',
                };
        }
    }

    // - -
    // Arrow position based on card side
    const getArrowStyle: (side: string) => React.CSSProperties = (side: string) => {
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
    const CardArrow = ({ isVisible }: { isVisible: boolean }) => {
        if (!isVisible) {
            return null;
        }
        return (
            <svg
                viewBox="0 0 54 54"
                data-name="onborda-arrow"
                className="absolute w-6 h-6 origin-center"
                style={getArrowStyle(currentTourSteps?.[currentStep]?.side as any)}
            >
                <path id="triangle" d="M27 27L0 0V54L27 27Z" fill="currentColor"/>
            </svg>
        );
    };

    // - -
    // Overlay Variants
    const variants = {
        visible: {opacity: 1},
        hidden: {opacity: 0},
    };

    // - -
    // Pointer Options
    const pointerPadding = currentTourSteps?.[currentStep]?.pointerPadding ?? 30;
    const pointerPadOffset = pointerPadding / 2;
    const pointerRadius = currentTourSteps?.[currentStep]?.pointerRadius ?? 28;
    const pointerEvents = pointerPosition && isOnbordaVisible ? 'pointer-events-none' : '';

    return (<>

        {/* Container for the Website content */}
        <div data-name="onborda-site-wrapper" className={` ${pointerEvents} `}>
            {children}
        </div>

        {/* Onborda Overlay Step Content */}
        {pointerPosition && isOnbordaVisible && CardComponent && (
            <Portal>
                <motion.div
                    data-name="onborda-overlay"
                    className="absolute inset-0 pointer-events-none"
                    initial="hidden"
                    animate={isOnbordaVisible ? "visible" : "hidden"}
                    variants={variants}
                    transition={{duration: 0.5}}
                >
                    <motion.div
                        data-name="onborda-pointer"
                        className="relative z-[998]"
                        style={{
                            boxShadow: `0 0 200vw 200vh rgba(${shadowRgb}, ${shadowOpacity})`,
                            borderRadius: `${pointerRadius}px ${pointerRadius}px ${pointerRadius}px ${pointerRadius}px`,
                        }}
                        initial={
                            pointerPosition
                                ? {
                                    x: pointerPosition.x - pointerPadOffset,
                                    y: pointerPosition.y - pointerPadOffset,
                                    width: pointerPosition.width + pointerPadding,
                                    height: pointerPosition.height + pointerPadding,
                                }
                                : {}
                        }
                        animate={
                            pointerPosition
                                ? {
                                    x: pointerPosition.x - pointerPadOffset,
                                    y: pointerPosition.y - pointerPadOffset,
                                    width: pointerPosition.width + pointerPadding,
                                    height: pointerPosition.height + pointerPadding,
                                }
                                : {}
                        }
                        transition={cardTransition}
                    >
                        {/* Card */}
                        <div
                            className="absolute flex flex-col max-w-[100%] transition-all min-w-min pointer-events-auto z-[999]"
                            data-name="onborda-card"
                            style={getCardStyle(
                                currentTourSteps?.[currentStep]?.side as any
                            )}
                        >
                            <CardComponent
                                step={currentTourSteps?.[currentStep]!}
                                currentStep={currentStep}
                                totalSteps={currentTourSteps?.length ?? 0}
                                nextStep={nextStep}
                                prevStep={prevStep}
                                arrow={<CardArrow
                                    isVisible={currentTourSteps?.[currentStep] ? hasSelector(currentTourSteps?.[currentStep]) : false}
                                />}
                            />
                        </div>
                    </motion.div>
                </motion.div>
            </Portal>
        )}

        <div data-name={'onborda-tour-wrapper'}
             className={'fixed top-0 left-0 z-[999] w-screen h-screen pointer-events-none'}>
            {TourComponent && currentTourSteps && (
                <div data-name={'onborda-tour'} className={'pointer-events-auto'}>
                    <TourComponent steps={currentTourSteps} currentTour={currentTour} currentStep={currentStep}/>
                </div>
            )}
        </div>
    </>);
};

export default Onborda;
