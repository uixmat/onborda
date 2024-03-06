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
  // Callbacks
  onClick?: () => void;
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
}
