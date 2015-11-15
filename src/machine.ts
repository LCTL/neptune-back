import {dm, Driver, Swarm} from 'nodedm';

export function * list() {
  this.body = yield dm.ls();
}

export function * inspect() {
  this.body = yield dm.inspect(this.params.name);
}

export function * create() {

  var name: string = this.params.name;
  var options = this.request.body;
  var driverName
  var driverOptions
  var driver: Driver;

  this.assert(options, 400, 'Please provide options');
  this.assert(options.driverName, 400, 'options.driverName not found');
  this.assert(options.driverOptions, 400, 'options.driverOptions not found');

  if (!name) {
    name = Date.now().toString();
  }

  driverName = options.driverName;
  driverOptions = options.driverOptions;
  driver = new Driver(driverName, driverOptions);

  yield dm.create(name, driver);
  this.body = yield dm.inspect(name);

}

export function * remove(name: string) {
  yield dm.remove(name);
  this.body = {
    value: true
  }
}
