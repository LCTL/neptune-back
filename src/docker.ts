import * as fs from 'fs';
import * as yargs from 'yargs';
import { dm } from 'nodedm';

const promisify = require('es6-promisify');
const Docker = require('dockerode');
const readFile: Function = promisify(fs.readFile);
const regxpFetchIpPort: RegExp = /[\w]+:\/\/(.*):([0-9]+)/i;

const containerInfo = promisify(Docker.prototype.info);

function * connectDocker(): any {
  const config: string = yield dm.config(this.params.name);
  const argv = yargs.parse(config.split(' '));
  const ca = yield readFile(argv.tlscacert.replace(/"/g, ''));
  const cert = yield readFile(argv.tlscert.replace(/"/g, ''));
  const key = yield readFile(argv.tlskey.replace(/"/g, ''));
  const ip = argv.H.replace(regxpFetchIpPort, '$1');
  const port = argv.H.replace(regxpFetchIpPort, '$2');
  const opt = {
    host: ip,
    port: port,
    ca: ca,
    cert: cert,
    key: key
  };
  return new Docker(opt);
}

function * connectLocalDocker(): any {
  return new Docker();
}

export function * connectDockerMiddleware(next) {
  this.docker = yield connectDocker.apply(this);
  yield next
}

export function * connectLocalDockerMiddleware(next) {
  this.docker = yield connectLocalDocker.apply(this);
  yield next
}

export function * info() {
  this.body = yield containerInfo.call(this.docker);
}
