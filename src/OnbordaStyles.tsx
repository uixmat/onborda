import React from "react";

export const getCardStyle: (side: string) => React.CSSProperties = (side: string) => {
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
        case "top-left":
            return {
                bottom: "100%",
                marginBottom: "25px",
            };
        case "top-right":
            return {
                right: 0,
                bottom: "100%",
                marginBottom: "25px",
            };
        case "bottom-left":
            return {
                top: "100%",
                marginTop: "25px",
            };
        case "bottom-right":
            return {
                right: 0,
                top: "100%",
                marginTop: "25px",
            };
        case "right-bottom":
            return {
                left: "100%",
                bottom: 0,
                marginLeft: "25px",
            };
        case "right-top":
            return {
                left: "100%",
                top: 0,
                marginLeft: "25px",
            };
        case "left-bottom":
            return {
                right: "100%",
                bottom: 0,
                marginRight: "25px",
            };
        case "left-top":
            return {
                right: "100%",
                top: 0,
                marginRight: "25px",
            };
        default:
            // Default case if no side is specified. Center the card to the screen
            return {
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)', // Center the card
                position: 'fixed', // Make sure it's positioned relative to the viewport
                margin: '0',
            };
    }
}

export const getArrowStyle: (side: string) => React.CSSProperties = (side: string) => {
    switch (side) {
        case "bottom":
            return {
                transform: `translate(-50%, 0) rotate(270deg)`,
                left: "50%",
                top: "-23px",
            };
        case "top":
            return {
                transform: `translate(-50%, 0) rotate(90deg)`,
                left: "50%",
                bottom: "-23px",
            };
        case "right":
            return {
                transform: `translate(0, -50%) rotate(180deg)`,
                top: "50%",
                left: "-23px",
            };
        case "left":
            return {
                transform: `translate(0, -50%) rotate(0deg)`,
                top: "50%",
                right: "-23px",
            };
        case "top-left":
            return {
                transform: `rotate(90deg)`,
                left: "10px",
                bottom: "-23px",
            };
        case "top-right":
            return {
                transform: `rotate(90deg)`,
                right: "10px",
                bottom: "-23px",
            };
        case "bottom-left":
            return {
                transform: `rotate(270deg)`,
                left: "10px",
                top: "-23px",
            };
        case "bottom-right":
            return {
                transform: `rotate(270deg)`,
                right: "10px",
                top: "-23px",
            };
        case "right-bottom":
            return {
                transform: `rotate(180deg)`,
                left: "-23px",
                bottom: "10px",
            };
        case "right-top":
            return {
                transform: `rotate(180deg)`,
                left: "-23px",
                top: "10px",
            };
        case "left-bottom":
            return {
                transform: `rotate(0deg)`,
                right: "-23px",
                bottom: "10px",
            };
        case "left-top":
            return {
                transform: `rotate(0deg)`,
                right: "-23px",
                top: "10px",
            };
        default:
            return {}; // Default case if no side is specified
    }
};
