class ApiError {
  constructor(statusCode, code, message) {
    this.statusCode = statusCode;
    this.code = code;
    this.message = message;
  }

  static badRequest(code, msg) {
    return new ApiError(400, code, msg);
  }

  static internalServerError(msg) {
    return new ApiError(500, code, msg);
  }
}

module.exports = ApiError;
