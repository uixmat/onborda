import React from "react";
interface OnbordaContextType {
    currentStep: number;
    setCurrentStep: (step: number, delay?: number) => void;
    closeOnborda: () => void;
    isOnbordaVisible: boolean;
}
declare const useOnborda: () => OnbordaContextType;
declare const OnbordaProvider: React.FC<{
    children: React.ReactNode;
}>;
export { OnbordaProvider, useOnborda };
