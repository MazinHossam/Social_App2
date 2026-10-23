"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validation = void 0;
const Validation = (schema) => {
    return (req, res, next) => {
        console.log(Object.keys(schema));
        next();
    };
};
exports.Validation = Validation;
