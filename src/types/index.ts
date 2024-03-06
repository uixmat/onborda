// Context
export interface OnbordaContextType {
  currentStep: number;
  setCurrentStep: (step: number, delay?: number) => void;
  closeOnborda: () => void;
  isOnbordaVisible: boolean;
}

// Step
export interface Step {
  // Step Content
  icon: React.ReactNode | string | null;
  title: string;
  content: React.ReactNode;
  selector: string;
  // Options
  side?: "top" | "bottom" | "left" | "right";
  showControls?: boolean;
  pointerPadding?: number;
  pointerRadius?: number;
  // Routing
  nextRoute?: string;
  prevRoute?: string;
}

// Onborda
export interface OnbordaProps {
  children: React.ReactNode;
  steps: Step[];
  showOnborda?: boolean;
  shadowRgb?: string;
  shadowOpacity?: string;
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
