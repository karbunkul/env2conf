function Env2ConfException(message) {
  Error.call(this, message) ;
  this.name = "Env2ConfException";
  this.message = message;

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, Env2ConfException);
  } else {
    this.stack = (new Error()).stack;
  }
}

Env2ConfException.prototype = Object.create(Error.prototype);

module.exports = Env2ConfException;
