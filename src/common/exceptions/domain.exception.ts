import { ApplicationException } from "./application.exception";

export class BadRequestException extends ApplicationException {
    constructor(message:string="Bad Request",cause?:unknown){
        super(message,400,cause);
    }
}
export class ConfilectException extends ApplicationException {
    constructor(message:string="Bad Request",cause?:unknown){
        super(message,409,cause);
    }
}
export class NotFoundException extends ApplicationException {
    constructor(message:string="Bad Request",cause?:unknown){
        super(message,404,cause);
    }
}
export class UnauthorizedException extends ApplicationException {
    constructor(message:string="Bad Request",cause?:unknown){
        super(message,401,cause);
    }
}
export class ForbiddenException extends ApplicationException {
    constructor(message:string="Bad Request",cause?:unknown){
        super(message,401,cause);
    }
}