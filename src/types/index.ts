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
  icon?: React.ReactNode | string | null;
  title: string;
  content: React.ReactNode;
  selector: string;
  // Options
  side?: "top" | "bottom" | "left" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | "left-top" | "left-bottom" | "right-top" | "right-bottom";
  showControls?: boolean;
  pointerPadding?: number;
  pointerRadius?: number;
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
export interface OnbordaProps {
  children: React.ReactNode;
  interact?: boolean;
  steps: Tour[];
  showOnborda?: boolean;
  shadowRgb?: string;
  shadowOpacity?: string;
  cardTransition?: Transition;
  cardComponent?: React.ComponentType<CardComponentProps>;
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
