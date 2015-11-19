import * as error from './error';
import * as machine from './machine';

var router = require('koa-trie-router');
var bodyParser = require('koa-bodyparser');
var koa = require('koa');
var mem = machine.machineExistMiddleware;

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

app.listen(3000);
