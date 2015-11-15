import * as errorHandler from './error_handler';
import * as machine from './machine';

var r = require('koa-route');
var bodyParser = require('koa-bodyparser');
var koa = require('koa');
var app = koa();

app.use(errorHandler.handle);
app.use(bodyParser());
app.use(require('koa-trie-router')(app));

app.route('/machines')
  .get(machine.list)
  .post(machine.create);

app.route('/machines/:name')
  .get(machine.inspect)
  .post(machine.create)
  .delete(machine.remove);

app.listen(3000);
