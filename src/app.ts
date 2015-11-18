import * as errorHandler from './error_handler';
import * as machine from './machine';

var router = require('koa-trie-router');
var bodyParser = require('koa-bodyparser');
var koa = require('koa');

export var app = koa();

app.use(errorHandler.handle);
app.use(bodyParser());
app.use(router(app));

app.route('/machines')
  .get(machine.list)
  .post(machine.create);

app.route('/machines/:name')
  .get(machine.inspect)
  .post(machine.create)
  .delete(machine.remove);

app.listen(3000);
