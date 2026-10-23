"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenException = exports.UnauthorizedException = exports.NotFoundException = exports.ConfilectException = exports.BadRequestException = void 0;
const application_exception_1 = require("./application.exception");
class BadRequestException extends application_exception_1.ApplicationException {
    constructor(message = "Bad Request", cause) {
        super(message, 400, cause);
    }
}
exports.BadRequestException = BadRequestException;
class ConfilectException extends application_exception_1.ApplicationException {
    constructor(message = "Bad Request", cause) {
        super(message, 409, cause);
    }
}
exports.ConfilectException = ConfilectException;
class NotFoundException extends application_exception_1.ApplicationException {
    constructor(message = "Bad Request", cause) {
        super(message, 404, cause);
    }
}
exports.NotFoundException = NotFoundException;
class UnauthorizedException extends application_exception_1.ApplicationException {
    constructor(message = "Bad Request", cause) {
        super(message, 401, cause);
    }
}
exports.UnauthorizedException = UnauthorizedException;
class ForbiddenException extends application_exception_1.ApplicationException {
    constructor(message = "Bad Request", cause) {
        super(message, 401, cause);
    }
}
exports.ForbiddenException = ForbiddenException;
