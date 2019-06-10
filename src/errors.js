// File for all error types defined

class ValueError extends Error {
  constructor (message) {
    super(message)
    this.name = 'ValueError'
    this.message = message
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValueError)
    }
  }
}

class ValidationError extends Error {
  constructor (message) {
    super(message)
    this.name = 'ValidationError'
    this.message = message
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError)
    }
  }
}

class InitializationError extends Error {
  constructor (message) {
    super(message)
    this.name = 'InitializationError'
    this.message = message
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InitializationError)
    }
  }
}

class CodingError extends Error {
  constructor (message) {
    super(message)
    this.name = 'CodingError'
    this.message = message
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CodingError)
    }
  }
}

export { CodingError, InitializationError, ValidationError, ValueError }
