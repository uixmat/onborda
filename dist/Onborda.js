"use client";
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
const react_1 = __importStar(require("react"));
const OnbordaContext_1 = require("./OnbordaContext");
const framer_motion_1 = require("framer-motion");
const Onborda = ({ children, steps, showOnborda = false, // Default to false
shadowRgb = "0, 0, 0", shadowOpacity = "0.2", }) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    const { currentStep, setCurrentStep, isOnbordaVisible } = (0, OnbordaContext_1.useOnborda)();
    const [pointerPosition, setPointerPosition] = (0, react_1.useState)(null);
    const currentElementRef = (0, react_1.useRef)(null);
    // - -
    // Helper function to get element position
    const getElementPosition = (element) => {
        const { top, left, width, height } = element.getBoundingClientRect();
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
        return {
            x: left + scrollLeft,
            y: top + scrollTop,
            width,
            height,
        };
    };
    // - -
    // Initialize and update step positioning
    (0, react_1.useEffect)(() => {
        if (steps.length > 0) {
            const firstStepElement = document.querySelector(steps[0].selector);
            if (firstStepElement) {
                const position = getElementPosition(firstStepElement);
                setPointerPosition(position);
            }
        }
    }, [steps]); // Dependency on steps ensures this runs once after initial render
    // - -
    // Update pointerPosition when currentStep changes
    (0, react_1.useEffect)(() => {
        const step = steps[currentStep];
        if (step) {
            const element = document.querySelector(step.selector);
            if (element) {
                setPointerPosition(getElementPosition(element));
            }
        }
    }, [currentStep, steps]); // Reacting to currentStep changes
    // - -
    // Update pointerPosition for currentStep changes or window resize
    const updatePointerPosition = () => {
        const step = steps[currentStep];
        if (step) {
            const element = document.querySelector(step.selector);
            if (element) {
                setPointerPosition(getElementPosition(element));
                currentElementRef.current = element;
            }
        }
    };
    // - -
    // Update pointer position on window resize
    (0, react_1.useEffect)(() => {
        updatePointerPosition();
        // Add window resize listener
        window.addEventListener("resize", updatePointerPosition);
        return () => {
            // Cleanup resize listener
            window.removeEventListener("resize", updatePointerPosition);
        };
    }, [currentStep, steps]);
    // - -
    // Step Controls
    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };
    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };
    // - -
    // Card Side
    const getCardStyle = (side) => {
        switch (side) {
            case "top":
                return {
                    transform: `translate(-50%, 0)`,
                    left: "50%",
                    bottom: "100%",
                    marginBottom: "25px",
                };
            case "bottom":
                return {
                    transform: `translate(-50%, 0)`,
                    left: "50%",
                    top: "100%",
                    marginTop: "25px",
                };
            case "left":
                return {
                    transform: `translate(0, -50%)`,
                    right: "100%",
                    top: "50%",
                    marginRight: "25px",
                };
            case "right":
                return {
                    transform: `translate(0, -50%)`,
                    left: "100%",
                    top: "50%",
                    marginLeft: "25px",
                };
            default:
                return {}; // Default case if no side is specified
        }
    };
    // - -
    // Arrow position based on card side
    const getArrowStyle = (side) => {
        switch (side) {
            case "bottom":
                return {
                    transform: `translate(-50%, 0) rotate(45deg)`,
                    left: "50%",
                    top: "-10px",
                };
            case "top":
                return {
                    transform: `translate(-50%, 0) rotate(45deg)`,
                    left: "50%",
                    bottom: "-10px",
                };
            case "right":
                return {
                    transform: `translate(0, -50%) rotate(45deg)`,
                    top: "50%",
                    left: "-10px",
                };
            case "left":
                return {
                    transform: `translate(0, -50%) rotate(45deg)`,
                    top: "50%",
                    right: "-10px",
                };
            default:
                return {}; // Default case if no side is specified
        }
    };
    // - -
    // Overlay Variants
    const variants = {
        visible: { opacity: 1 },
        hidden: { opacity: 0 },
    };
    // - -
    // Pointer Options
    const pointerPadding = (_b = (_a = steps[currentStep]) === null || _a === void 0 ? void 0 : _a.pointerPadding) !== null && _b !== void 0 ? _b : 30;
    const pointerPadOffset = pointerPadding / 2;
    const pointerRadius = (_d = (_c = steps[currentStep]) === null || _c === void 0 ? void 0 : _c.pointerRadius) !== null && _d !== void 0 ? _d : 28;
    return (<div data-name="onborda-wrapper" className="relative w-full">
      {/* Container for the Website content */}
      <div data-name="onborda-site" className="relative block w-full">
        {children}
      </div>

      {/* Onborda Overlay Step Content */}
      {pointerPosition && showOnborda && (<framer_motion_1.motion.div data-name="onborda-overlay" className="fixed inset-0 z-[995] pointer-events-none" initial="hidden" animate={isOnbordaVisible ? "visible" : "hidden"} // TODO: if hidden, reduce zIndex
         variants={variants} transition={{ duration: 0.5 }}>
          <framer_motion_1.motion.div data-name="onborda-pointer" className="relative z-[999]" style={{
                boxShadow: `0 0 200vw 200vh rgba(${shadowRgb}, ${shadowOpacity})`,
                borderRadius: `${pointerRadius}px ${pointerRadius}px ${pointerRadius}px ${pointerRadius}px`,
            }} initial={pointerPosition
                ? {
                    x: pointerPosition.x - pointerPadOffset,
                    y: pointerPosition.y - pointerPadOffset,
                    width: pointerPosition.width + pointerPadding,
                    height: pointerPosition.height + pointerPadding,
                }
                : {}} animate={pointerPosition
                ? {
                    x: pointerPosition.x - pointerPadOffset,
                    y: pointerPosition.y - pointerPadOffset,
                    width: pointerPosition.width + pointerPadding,
                    height: pointerPosition.height + pointerPadding,
                }
                : {}} transition={{ ease: "anticipate", duration: 0.6 }}>
            {/* Card */}
            <div className="absolute flex flex-col w-[400px] p-8 text-black transition-all bg-white shadow-lg rounded-20 min-w-min pointer-events-auto" data-name="onborda-card" style={getCardStyle((_e = steps[currentStep]) === null || _e === void 0 ? void 0 : _e.side)}>
              {/* Card Arrow */}
              <div data-name="onborda-arrow" className="absolute w-5 h-5 origin-center bg-white" style={getArrowStyle((_f = steps[currentStep]) === null || _f === void 0 ? void 0 : _f.side)}/>
              {/* Card Header */}
              <div className="flex items-center justify-between gap-5 mb-4">
                <h2 className="text-xl leading-[25px] font-bold">
                  {(_g = steps[currentStep]) === null || _g === void 0 ? void 0 : _g.icon} {(_h = steps[currentStep]) === null || _h === void 0 ? void 0 : _h.title}
                </h2>
                <div className="text-utility140 text-[15px] font-semibold">
                  {currentStep + 1} of {steps.length}
                </div>
              </div>
              {/* Card Stepper */}
              <div data-name="onborda-stepper" className="flex w-full gap-1 mb-8">
                {steps.map((_, index) => (<span key={index} data-name="onborda-step" className={`self-stretch w-full h-1 rounded-xl ${index === currentStep ? "bg-primary1" : "bg-utility140"}`}/>))}
              </div>

              {/* Card Content */}
              <div className="text-[15px]">{(_j = steps[currentStep]) === null || _j === void 0 ? void 0 : _j.content}</div>

              {/* Stepper Controls */}
              {((_k = steps[currentStep]) === null || _k === void 0 ? void 0 : _k.showControls) && (<div className="flex items-center w-full gap-4">
                  <button data-control="prev" onClick={prevStep}>
                    prev
                  </button>
                  <button data-control="next" onClick={nextStep}>
                    next
                  </button>
                </div>)}
            </div>
          </framer_motion_1.motion.div>
        </framer_motion_1.motion.div>)}
    </div>);
};
exports.default = Onborda;
