const promisify = require('es6-promisify');
const Docker = require('dockerode');

const searchImg = promisify(Docker.prototype.searchImages);

export function * searchImages() {
  this.body = yield searchImg.call(this.docker, this.query);
}
