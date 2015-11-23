const promisify = require('es6-promisify');

function * postAction (name: string, opt: any) {
  return yield promisify(this.container[name].bind(this.container))(opt);
}

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

export function * start() {
  yield postAction.call(this, 'start', this.request.body);
  this.status = 204;
}

export function * stop() {
  yield postAction.call(this, 'stop', this.request.body);
  this.status = 204;
}

export function * kill() {
  yield postAction.call(this, 'kill', this.request.body);
  this.status = 204;
}

export function * restart() {
  yield postAction.call(this, 'restart', this.request.body);
  this.status = 204;
}
