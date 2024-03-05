"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Onborda = exports.useOnborda = exports.OnbordaProvider = void 0;
var OnbordaContext_1 = require("./OnbordaContext");
Object.defineProperty(exports, "OnbordaProvider", { enumerable: true, get: function () { return OnbordaContext_1.OnbordaProvider; } });
Object.defineProperty(exports, "useOnborda", { enumerable: true, get: function () { return OnbordaContext_1.useOnborda; } });
var Onborda_1 = require("./Onborda");
Object.defineProperty(exports, "Onborda", { enumerable: true, get: function () { return __importDefault(Onborda_1).default; } });
