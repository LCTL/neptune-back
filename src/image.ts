const promisify = require('es6-promisify');

export function * list() {
  this.body = yield promisify(this.docker.listImages.bind(this.docker))(this.query);
}

export function * create() {
  this.body = yield promisify(this.docker.createImage.bind(this.docker))(this.request.body);
}
