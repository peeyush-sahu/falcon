class DetectTextException extends Error {  
    constructor (message) {
      super(message)
  
      // assign the error class name in your custom error (as a shortcut)
      this.name = this.constructor.name
  
      // capturing the stack trace keeps the reference to your error class
      Error.captureStackTrace(this, this.constructor);
  
      // you may also assign additional properties to your error
      this.success = false
      this.errorMessage = message
    }
}

// a list of exported variables
export default DetectTextException