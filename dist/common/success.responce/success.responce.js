"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.successResponce = void 0;
const successResponce = ({ res, message = "Done", status = 200, data }) => {
    return res.status(status).json({
        message,
        status,
        data
    });
};
exports.successResponce = successResponce;
