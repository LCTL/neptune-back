const promisify = require('es6-promisify');
const Docker = require('dockerode');

const listImages = promisify(Docker.prototype.listImages);
const createImage = promisify(Docker.prototype.createImage);

export function * connectImageMiddleware(next) {
  if (this.params.iname) {
    this.image = this.docker.getImage(this.params.iname);
    try{
      this.imageInspect = yield promisify(this.image.inspect.bind(this.image));
    } catch (err) {
      if (err.statusCode && err.reason) {
        this.throw(err.statusCode, err.reason);
      } else {
        throw err;
      }
    }
  }
  yield next
}

export function * list() {
  this.body = yield listImages.call(this.docker, this.query);
}

export function * create() {
  this.body = yield createImage.call(this.docker, this.request.body);
}

export function * inspect() {
  this.body = this.imageInspect
}

export function * remove() {
  this.body = yield promisify(this.image.remove.bind(this.image))(this.request.body);
}
