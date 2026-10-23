"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOTP = void 0;
const generateOTP = () => {
    return Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);
};
exports.generateOTP = generateOTP;
