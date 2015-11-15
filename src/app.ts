import {dm} from 'nodedm';
var koa = require('koa');
var app = koa();

app.use(function *(next){
  var start = Date.now();
  yield next;
  var ms = Date.now() - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});

// response
app.use(function *(){
  this.body = yield dm.inspect('vbox0')
});

app.listen(3000);
