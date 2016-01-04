import {dm} from 'nodedm';

export function * machineExistMiddleware(next) {
  if (this.params.name) {
    var names: string[] = yield dm.ls({quiet: ''});
    this.assert(names.indexOf(this.params.name) > -1, 404, 'Machine not found');
  }
  yield next
}

export function * list() {
  this.body = yield dm.ls(this.query);
}

export function * inspect() {
  this.body = yield dm.inspect(this.params.name, this.query);
}

export function * create() {
  var name: string = this.params.name;
  var options = this.request.body;

  this.assert(options, 400, 'Please provide options');

  if (!name) {
    name = Date.now().toString();
  }

  yield dm.create(name, options);

  this.body = yield dm.inspect(name);
}

export function * remove() {
  yield dm.rm(this.params.name, this.request.body);
  this.status = 204;
}

export function * ip() {
  var ip = yield dm.ip(this.params.name, this.request.body);
  this.body = {
    value: ip
  }
}

export function * kill() {
  yield dm.kill(this.params.name, this.request.body);
  this.status = 204;
}

export function * restart() {
  yield dm.restart(this.params.name, this.request.body);
  this.status = 204;
}

export function * start() {
  yield dm.start(this.params.name, this.request.body);
  this.status = 204;
}

export function * status() {
  var status = yield dm.status(this.params.name, this.query);
  this.body = {
    value: status
  }
}

export function * stop() {
  yield dm.stop(this.params.name, this.request.body);
  this.status = 204;
}

export function * regenerateCerts() {
  yield dm.regenerateCert(this.params.name, this.request.body);
  this.status = 204;
}
