import { Transition } from "framer-motion";
export interface OnbordaProviderProps {
    /** The children elements to be rendered inside the OnbordaProvider component */
    children: React.ReactNode;
    /** An array of tours, each containing multiple steps */
    tours: Tour[];
    /** Active Tour */
    activeTour?: string;
}
export interface OnbordaContextType {
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
    completedSteps: Set<number | string>;
    /** setstate function to set the completed steps */
    setCompletedSteps: React.Dispatch<React.SetStateAction<Set<number | string>>>;
}
export interface Step {
    /** The unique identifier for the step */
    id?: string;
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
    /** Initial completed state of the step. an async function called on tour started.*/
    initialCompletedState?: () => Promise<boolean>;
    /** The route for this step */
    route?: string;
    /** The route to navigate to for the next step */
    /** @deprecated Use `route` instead */
    nextRoute?: string;
    /** The route to navigate to for the previous step */
    /** @deprecated Use `route` instead */
    prevRoute?: string;
}
export interface Tour {
    /** The name of the tour */
    tour: string;
    /** An array of steps in the tour */
    steps: Step[];
}
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
    /** The arrow element to be displayed in the card */
    arrow: JSX.Element;
    /** Array of completed steps */
    completedSteps: (string | number)[];
}
export interface TourComponentProps {
    /** The current tour name */
    currentTour: string | null;
    /** The index of the current step */
    currentStep: number;
    /** An array of steps in the current tour */
    steps: Step[];
    /** Function to set the current step by step index or step.id */
    setStep: (step: number | string) => void;
    /** Array of completed steps */
    completedSteps: (string | number)[];
}
