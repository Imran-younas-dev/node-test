export default class AppValidationError extends Error {
    constructor(message, code = 422) {
        super(message)
        this.name = 'AppValidationError'
        this.code = code
    }
}

export class AppValidationErrorWithData extends AppValidationError {
    constructor(message, data) {
        super(message)
        this.name = 'AppValidationErrorWithData'
        this.data = data
    }
}
