import * as error from './error';
import * as machine from './machine';
import * as docker from './docker';
import * as container from './container';
import * as image from './image';

var router = require('koa-trie-router');
var bodyParser = require('koa-bodyparser');
var koa = require('koa');
var mem = machine.machineExistMiddleware;
var cdm = docker.connectDockerMiddleware;
var ccm = container.connectContainerMiddleware;

export var app = koa();

app.use(error.handler);
app.use(bodyParser());
app.use(router(app));

app.route('/machines')
  .get(machine.list)
  .post(machine.create);

app.route('/machines/:name')
  .get(mem, machine.inspect)
  .post(machine.create)
  .delete(mem, machine.remove);

app.get('/machines/:name/ip', mem, machine.ip);
app.post('/machines/:name/kill', mem, machine.kill);
app.post('/machines/:name/restart', mem, machine.restart);
app.post('/machines/:name/start', mem, machine.start);
app.get('/machines/:name/status', mem, machine.status);
app.post('/machines/:name/stop', mem, machine.stop);

app.get('/machines/:name/containers', mem, cdm, container.ps);
app.post('/machines/:name/containers', mem, cdm, container.create);
app.get('/machines/:name/containers/:cid', mem, cdm, ccm, container.inspect);
app.post('/machines/:name/containers/:cid/start', mem, cdm, ccm, container.start);
app.post('/machines/:name/containers/:cid/stop', mem, cdm, ccm, container.stop);
app.post('/machines/:name/containers/:cid/kill', mem, cdm, ccm, container.kill);
app.post('/machines/:name/containers/:cid/restart', mem, cdm, ccm, container.restart);

app.get('/machines/:name/images', mem, cdm, image.list);
app.post('/machines/:name/images', mem, cdm, image.create);

app.listen(3000);
