export function * handler(next) {
  try {
    yield next;
  } catch (err) {
    this.status = err.status || 500;
    this.body = {
      error: {
        status: this.status,
        message: err.message
      }
    };
    this.app.emit('error', err, this);
  }
};
