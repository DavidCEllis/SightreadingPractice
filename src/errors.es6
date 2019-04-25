// File for all error types defined

class ValidationError extends Error {
  constructor (message) {
    super(message)
    this.name = 'ValidationError'
    this.message = message
  }
}

class InitializationError extends Error {
  constructor (message) {
    super(message)
    this.name = 'InitializationError'
    this.message = message
  }
}

class CodingError extends Error {
  constructor (message) {
    super(message)
    this.name = 'CodingError'
    this.message = message
  }
}

export { CodingError, InitializationError, ValidationError }
