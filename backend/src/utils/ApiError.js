class ApiError extends Error {
    constructor(
        StatusCode,
        Errors = [],
        message = "Something went wrong",
        stack = ""
    ) {
        super(message);
        this.StatusCode = StatusCode;
        this.Errors = Errors;
        this.data = null;
        this.success = false;
        this.message = message;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };
