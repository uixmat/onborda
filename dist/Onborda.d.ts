import React from "react";
interface Step {
    icon: React.ReactNode | string | null;
    title: string;
    content: React.ReactNode;
    selector: string;
    side?: "top" | "bottom" | "left" | "right";
    showControls?: boolean;
    pointerPadding?: number;
    pointerRadius?: number;
    onClick?: () => void;
    nextRoute?: () => void;
    prevRoute?: () => void;
}
interface OnbordaProps {
    children: React.ReactNode;
    steps: Step[];
    showOnborda?: boolean;
    shadowRgb?: string;
    shadowOpacity?: string;
}
declare const Onborda: React.FC<OnbordaProps>;
export default Onborda;
