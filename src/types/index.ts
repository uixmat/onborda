import { Transition } from "framer-motion";

// Context
export interface OnbordaContextType {
  currentStep: number;
  currentTour: string | null;
  setCurrentStep: (step: number, delay?: number) => void;
  closeOnborda: () => void;
  startOnborda: (tourName: string) => void;
  isOnbordaVisible: boolean;
}

// Step
export interface Step {
    // Step Content
    /** The icon to be displayed in the step */
    icon: React.ReactNode | string | null;
    /** The title of the step */
    title: string;
    /** The content to be displayed in the step */
    content: React.ReactNode;
    /** The CSS selector for the element to highlight. Takes precedence over customQuerySelector if both are provided. */
    selector?: string;
    /** A custom function to query the target element. Ignored if selector is provided. */
    customQuerySelector?: () => Element | null;

    // Options
    /** The side where the step should be displayed */
    side?: "top" | "bottom" | "left" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | "left-top" | "left-bottom" | "right-top" | "right-bottom";
    /** Flag to show or hide the controls */
    showControls?: boolean;
    /** Padding around the pointer */
    pointerPadding?: number;
    /** Radius of the pointer */
    pointerRadius?: number;
    /** Flag to make the step interactable */
    interactable?: boolean;
    /** Conditions to be met before the next step can be triggered. Function is bound to event listeners on the target element on 'input', 'change' and 'click' events. */
    nextStepConditions?: (element: Element | null) => boolean;

    // Routing
    /** The route to navigate to for the next step */
    nextRoute?: string;
    /** The route to navigate to for the previous step */
    prevRoute?: string;

}

// Tour
// 
export interface Tour {
  tour: string;
  steps: Step[];
}

// Onborda
//
export interface OnbordaProps {
    /** The children elements to be rendered inside the Onborda component */
    children: React.ReactNode;

    /** An array of tours, each containing multiple steps */
    steps: Tour[];

    /** Flag to show or hide the Onborda component */
    showOnborda?: boolean;

    /** RGB value for the shadow color */
    shadowRgb?: string;

    /** Opacity value for the shadow */
    shadowOpacity?: string;

    /** Transition settings for the card component */
    cardTransition?: Transition;

    /** Custom card component to be used in the Onborda */
    cardComponent?: React.ComponentType<CardComponentProps>;

    /** Custom tour component to be used in the Onborda */
    tourComponent?: React.ComponentType<TourComponentProps>;

    /** Flag to enable or disable debug mode */
    debug?: boolean;

    /** Timeout value for the observer when observing for the target element */
    observerTimeout?: number;
}

// Custom Card
export interface CardComponentProps {
    /** The current step object containing details of the step */
    step: Step;

    /** The index of the current step */
    currentStep: number;

    /** The total number of steps in the tour */
    totalSteps: number;

    /** Function to navigate to the next step */
    nextStep: () => void;

    /** Function to navigate to the previous step */
    prevStep: () => void;

    /** The arrow element to be displayed in the card */
    arrow: JSX.Element;

    /** Boolean for whether the nextStepConditions are met */
    canProceed: boolean;
}

// Tour Component
export interface TourComponentProps {
  currentTour: string | null;
  currentStep: number;
  steps: Step[];
}
