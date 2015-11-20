const promisify = require('es6-promisify');

export function * connectContainerMiddleware(next) {
  if (this.params.cid) {
    this.container = this.docker.getContainer(this.params.cid);
    try{
      this.containerInspect = yield promisify(this.container.inspect.bind(this.container));
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

export function * ps() {
  var containers = yield promisify(this.docker.listContainers.bind(this.docker))(this.query);
  this.body = containers;
}

export function * create() {
  var container = yield promisify(this.docker.createContainer.bind(this.docker))(this.request.body);
  this.body = {
    value: container.id
  };
}

export function * inspect() {
  this.body = this.containerInspect;
}
