"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOnborda = exports.OnbordaProvider = void 0;
const react_1 = __importStar(require("react"));
const OnbordaContext = (0, react_1.createContext)(undefined);
const useOnborda = () => {
    const context = (0, react_1.useContext)(OnbordaContext);
    if (context === undefined) {
        throw new Error("useOnborda must be used within an OnbordaProvider");
    }
    return context;
};
exports.useOnborda = useOnborda;
const OnbordaProvider = ({ children, }) => {
    const [currentStep, setCurrentStepState] = (0, react_1.useState)(0);
    const [isOnbordaVisible, setOnbordaVisible] = (0, react_1.useState)(true);
    const setCurrentStep = (0, react_1.useCallback)((step, delay) => {
        if (delay) {
            setTimeout(() => {
                setCurrentStepState(step);
                setOnbordaVisible(true);
            }, delay);
        }
        else {
            setCurrentStepState(step);
            setOnbordaVisible(true);
        }
    }, []);
    const closeOnborda = (0, react_1.useCallback)(() => {
        setOnbordaVisible(false);
    }, []);
    return (<OnbordaContext.Provider value={{ currentStep, setCurrentStep, closeOnborda, isOnbordaVisible }}>
      {children}
    </OnbordaContext.Provider>);
};
exports.OnbordaProvider = OnbordaProvider;
