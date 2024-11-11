import React from "react";
import { OnbordaContextType, OnbordaProviderProps } from "./types";
declare const useOnborda: () => OnbordaContextType;
declare const OnbordaProvider: React.FC<OnbordaProviderProps>;
export { OnbordaProvider, useOnborda };
