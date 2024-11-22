import { Transition } from "framer-motion";

// Provider
export interface OnbordaProviderProps {
    /** The children elements to be rendered inside the OnbordaProvider component */
    children: React.ReactNode;
    /** An array of tours, each containing multiple steps */
    tours: Tour[];
    /** Active Tour */
    activeTour?: string;
}

// Context
export interface OnbordaContextType {
    /** array of tours */
    tours: Tour[];
    /** current step index */
    currentStep: number;
    /** current tour name */
    currentTour: string | null;
    /** current tour steps */
    currentTourSteps: Step[];
    /** function to set the current step */
    setCurrentStep: (step: number | string, delay?: number) => void;
    /** function to close Onborda */
    closeOnborda: () => void;
    /** function to start Onborda */
    startOnborda: (tourName: string) => void;
    /** flag to check if Onborda is visible */
    isOnbordaVisible: boolean;
    /** default completed steps */
    completedSteps: Set<number>;
    /** setstate function to set the completed steps */
    setCompletedSteps: React.Dispatch<React.SetStateAction<Set<number>>>;
}

// Step
export interface Step {
    // Step Content
    /** The unique identifier for the step */
    id?: string;
    /** The title of the step */
    title?: string;
    /** The content to be displayed in the step */
    content: React.ReactNode;
    /** The icon to be displayed in the step */
    icon?: React.ReactNode | string | null;
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
    isCompleteConditions?: (element: Element | null) => boolean;

    // Routing
    /** The route for this step */
    route?: string;
    /** The route to navigate to for the next step */
    /** @deprecated Use `route` instead */
    nextRoute?: string;
    /** The route to navigate to for the previous step */
    /** @deprecated Use `route` instead */
    prevRoute?: string;

    // Callbacks
    /** Callback function to be called when the step is completed */
    onComplete?: () => Promise<void>;

    /** Any additional data for custom use */
    [key: string]: any;

}

// Tour
// 
export interface Tour {
    /** The tour ID */
    tour: string;
    /** Tour Title */
    title?: string;
    /** Tour Description */
    description?: string;
    /** An array of steps in the tour */
    steps: Step[];
    /** Complete Callback */
    onComplete?: () => void;
    /** Tour can be dismissed. */
    dismissible?: boolean;
    /** Any additional data for custom use */
    [key: string]: any;
    /** Initial completed steps state of the tour. an async function called on tour started. Can be a Server Action e.g. Promise.all([]) on API calls. */
    initialCompletedStepsState?: () => Promise<boolean[]>;
}

// Onborda
//
export interface OnbordaProps {
    /** The children elements to be rendered inside the Onborda component */
    children: React.ReactNode;

    /** An array of tours, each containing multiple steps */
    /** @deprecated Use `OnbordaProvider.tours` instead */
    steps?: Tour[];

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

    /** Function to set the current step by step index or step.id */
    setStep: (step: number | string) => void;

    /** Function to navigate to the next step */
    nextStep: () => void;

    /** Function to navigate to the previous step */
    prevStep: () => void;

    /** Function to close the Onborda */
    closeOnborda: () => void;

    /** The arrow element to be displayed in the card */
    arrow: JSX.Element;

    /** Array of completed steps */
    completedSteps: (string|number)[];

    /** Is waiting for Route change */
    pendingRouteChange: boolean;
}

// Tour Component
export interface TourComponentProps {
    /** The current tour name */
    currentTour: string | null;
    /** The index of the current step */
    currentStep: number;
    /** The current Tour object containing details of the tour */
    tour: Tour;
    /** Function to set the current step by step index or step.id */
    setStep: (step: number | string) => void;
    /** Array of completed steps */
    completedSteps: (string|number)[];
    /** Function to close the Onborda */
    closeOnborda: () => void;
}
