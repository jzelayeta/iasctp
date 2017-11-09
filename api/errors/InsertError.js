/**
 * Created by jzelayeta on 11/9/17.
 */

'use strict';

class InsertError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        this.message = message;
        Error.captureStackTrace(this, this.constructor.name);
    }
    setErrorsAndThrow(errors) {
        this.errors = errors;
        if(this.errors.some(err => err instanceof Error)){
            throw this;
        }
    }
}

module.exports = InsertError;
