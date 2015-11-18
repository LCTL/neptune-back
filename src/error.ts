export function * handler(next) {
  try {
    yield next;
  } catch (err) {
    if (typeof err === 'string') {
      this.status = 500;
      this.body = err;
      this.app.emit('error', new Error(err), this);
    } else {
      this.status = err.status || 500;
      this.body = err.message;
      this.app.emit('error', err, this);
    }
  }
};
