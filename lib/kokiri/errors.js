class KokiriError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.message = this.message;
    Error.captureStackTrace(this, this.contructor);
  }
}

module.exports = {
  KokiriError,
};
