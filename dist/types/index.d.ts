/// <reference types="react" />
export interface OnbordaContextType {
    currentStep: number;
    setCurrentStep: (step: number, delay?: number) => void;
    closeOnborda: () => void;
    startOnborda: () => void;
    isOnbordaVisible: boolean;
}
export interface Step {
    icon: React.ReactNode | string | null;
    title: string;
    content: React.ReactNode;
    selector: string;
    side?: "top" | "bottom" | "left" | "right";
    showControls?: boolean;
    pointerPadding?: number;
    pointerRadius?: number;
    nextRoute?: string;
    prevRoute?: string;
}
export interface OnbordaProps {
    children: React.ReactNode;
    steps: Step[];
    showOnborda?: boolean;
    shadowRgb?: string;
    shadowOpacity?: string;
    cardComponent?: React.ComponentType<CardComponentProps>;
}
export interface CardComponentProps {
    step: Step;
    currentStep: number;
    totalSteps: number;
    nextStep: () => void;
    prevStep: () => void;
    arrow: JSX.Element;
}
