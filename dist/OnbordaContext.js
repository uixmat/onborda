import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useCallback } from "react";
var OnbordaContext = createContext(undefined);
var useOnborda = function () {
    var context = useContext(OnbordaContext);
    if (context === undefined) {
        throw new Error("useOnborda must be used within an OnbordaProvider");
    }
    return context;
};
var OnbordaProvider = function (_a) {
    var children = _a.children;
    var _b = useState(0), currentStep = _b[0], setCurrentStepState = _b[1];
    var _c = useState(true), isOnbordaVisible = _c[0], setOnbordaVisible = _c[1];
    var setCurrentStep = useCallback(function (step, delay) {
        if (delay) {
            setTimeout(function () {
                setCurrentStepState(step);
                setOnbordaVisible(true);
            }, delay);
        }
        else {
            setCurrentStepState(step);
            setOnbordaVisible(true);
        }
    }, []);
    var closeOnborda = useCallback(function () {
        setOnbordaVisible(false);
    }, []);
    return (_jsx(OnbordaContext.Provider, { value: { currentStep: currentStep, setCurrentStep: setCurrentStep, closeOnborda: closeOnborda, isOnbordaVisible: isOnbordaVisible }, children: children }));
};
export { OnbordaProvider, useOnborda };
