import * as error from './error';
import * as machine from './machine';
import * as docker from './docker';
import * as container from './container';
import * as image from './image';
import * as hub from './hub';
import * as registry from './registry';

var router = require('koa-trie-router');
var bodyParser = require('koa-bodyparser');
var koa = require('koa');
var cors = require('kcors');
var mem = machine.machineExistMiddleware;
var cdm = docker.connectDockerMiddleware;
var cldm = docker.connectLocalDockerMiddleware;
var ccm = container.connectContainerMiddleware;
var cim = image.connectImageMiddleware;

export var app = koa();

app.use(error.handler);
app.use(cors());
app.use(bodyParser());
app.use(router(app));

for (let key in registry) {
  app.use(registry[key]);
}

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

app.get('/machines/:name/docker', mem, cdm, docker.info);

app.get('/machines/:name/containers', mem, cdm, container.ps);
app.post('/machines/:name/containers', mem, cdm, container.create);
app.get('/machines/:name/containers/:cid', mem, cdm, ccm, container.inspect);
app.delete('/machines/:name/containers/:cid', mem, cdm, ccm, container.remove);
app.get('/machines/:name/containers/:cid/logs', mem, cdm, ccm, container.logs);
app.post('/machines/:name/containers/:cid/start', mem, cdm, ccm, container.start);
app.post('/machines/:name/containers/:cid/stop', mem, cdm, ccm, container.stop);
app.post('/machines/:name/containers/:cid/kill', mem, cdm, ccm, container.kill);
app.post('/machines/:name/containers/:cid/restart', mem, cdm, ccm, container.restart);
app.post('/machines/:name/containers/:cid/pause', mem, cdm, ccm, container.pause);
app.post('/machines/:name/containers/:cid/unpause', mem, cdm, ccm, container.unpause);

app.get('/machines/:name/images', mem, cdm, image.list);
app.post('/machines/:name/images', mem, cdm, image.create);
app.get('/machines/:name/images/:iname', mem, cdm, cim, image.inspect);
app.delete('/machines/:name/images/:iname', mem, cdm, cim, image.remove);

app.get('/machines/:name/hub/images', mem, cdm, hub.searchImages);

// local docker
app.get('/local/docker', cldm, docker.info);

app.route('/local/containers')
  .get(cldm, container.ps)
  .post(cldm, container.create);

app.route('/local/containers/:cid')
  .get(cldm, ccm, container.inspect)
  .delete(cldm, ccm, container.remove);

app.get('/local/containers/:cid/logs', cldm, ccm, container.logs);
app.post('/local/containers/:cid/start', cldm, ccm, container.start);
app.post('/local/containers/:cid/stop', cldm, ccm, container.stop);
app.post('/local/containers/:cid/kill', cldm, ccm, container.kill);
app.post('/local/containers/:cid/restart', cldm, ccm, container.restart);
app.post('/local/containers/:cid/pause', cldm, ccm, container.pause);
app.post('/local/containers/:cid/unpause', cldm, ccm, container.unpause);

app.route('/local/images')
  .get(cldm, image.list)
  .post(cldm, image.create);
app.get('/local/images/:iname', cldm, cim, image.inspect);
app.delete('/local/images/:iname', cldm, cim, image.remove);

app.listen(3000);
