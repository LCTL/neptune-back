import {dm, Driver, Swarm} from 'nodedm';

export function * machineExistMiddleware(next) {
  if (this.params.name) {
    var names: string[] = yield dm.ls(true);
    this.assert(names.indexOf(this.params.name) > -1, 404, 'Machine not found');
  }
  yield next
}

export function * list() {
  this.body = yield dm.ls();
}

export function * inspect() {
  this.body = yield dm.inspect(this.params.name);
}

export function * create() {
  var name: string = this.params.name;
  var options = this.request.body;
  var driver: Driver;
  var swarm: Swarm;

  this.assert(options, 400, 'Please provide options');
  this.assert(options.driver, 400, 'options.drive not found');

  if (!name) {
    name = Date.now().toString();
  }

  driver = options.driver;
  swarm = options.swarm;

  yield dm.create(name, driver, swarm);

  this.body = yield dm.inspect(name);
}

export function * remove() {
  yield dm.rm(this.params.name);
  this.body = {
    value: true
  }
}
