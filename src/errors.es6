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

export { InitializationError, ValidationError }
