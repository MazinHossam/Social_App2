"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validation = void 0;
const exceptions_1 = require("../common/exceptions");
const Validation = (schema, filesifbody = false) => {
    return (req, res, next) => {
        console.log(Object.keys(schema));
        const issues = [];
        for (const key of Object.keys(schema)) {
            if (!schema[key]) {
                continue;
            }
            if (key === "body" && filesifbody == true) {
                req.body.files = req.files;
            }
            const validationResult = schema[key].safeParse(req[key]);
            if (!validationResult.success) {
                issues.push({ key, issues: validationResult.error.issues.map(issue => { return { path: issue.path, message: issue.message }; }) });
            }
        }
        if (issues.length) {
            throw new exceptions_1.BadRequestException("Validation Error", { issues });
        }
        next();
    };
};
exports.Validation = Validation;
