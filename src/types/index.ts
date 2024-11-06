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
  icon: React.ReactNode | string | null;
  title: string;
  content: React.ReactNode;
  selector?: string;
  customQuerySelector?: () => Element | null;
  // Options
  side?: "top" | "bottom" | "left" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | "left-top" | "left-bottom" | "right-top" | "right-bottom";
  showControls?: boolean;
  pointerPadding?: number;
  pointerRadius?: number;
  interactable?: boolean;
  // Routing
  nextRoute?: string;
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
    // The children elements to be rendered inside the Onborda component
    children: React.ReactNode;

    // An array of tours, each containing multiple steps
    steps: Tour[];

    // Flag to show or hide the Onborda component
    showOnborda?: boolean;

    // RGB value for the shadow color
    shadowRgb?: string;

    // Opacity value for the shadow
    shadowOpacity?: string;

    // Transition settings for the card component
    cardTransition?: Transition;

    // Custom card component to be used in the Onborda
    cardComponent?: React.ComponentType<CardComponentProps>;

    // Custom tour component to be used in the Onborda
    tourComponent?: React.ComponentType<TourComponentProps>;

    // Flag to enable or disable debug mode
    debug?: boolean;

    // Timeout value for the observer when observing for the target element
    observerTimeout?: number;
}

// Custom Card
export interface CardComponentProps {
  step: Step;
  currentStep: number;
  totalSteps: number;
  nextStep: () => void;
  prevStep: () => void;
  arrow: JSX.Element;
}

// Tour Component
export interface TourComponentProps {
  currentTour: string | null;
  currentStep: number;
  steps: Step[];
}
