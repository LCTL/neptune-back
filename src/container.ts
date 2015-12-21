const promisify = require('es6-promisify');
const Docker = require('dockerode');

const listContainers = promisify(Docker.prototype.listContainers);
const createContainer = promisify(Docker.prototype.createContainer);

function * action (name: string) {
  return yield promisify(this.container[name].bind(this.container))(this.request.body);
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
  var containers = yield listContainers.call(this.docker, this.query);
  this.body = containers;
}

export function * create() {
  var container = yield createContainer.call(this.docker, this.request.body);
  this.body = {
    value: container.id
  };
}

export function * inspect() {
  this.body = this.containerInspect;
}

export function * logs() {
  this.type = 'text/plain; charset=utf-8';
  this.body = yield promisify(this.container.logs.bind(this.container))(this.query);
}

export function * start() {
  yield action.call(this, 'start');
  this.status = 204;
}

export function * stop() {
  yield action.call(this, 'stop');
  this.status = 204;
}

export function * kill() {
  yield action.call(this, 'kill');
  this.status = 204;
}

export function * restart() {
  yield action.call(this, 'restart');
  this.status = 204;
}

export function * remove() {
  yield action.call(this, 'remove');
  this.status = 204;
}
