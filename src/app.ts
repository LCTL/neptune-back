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
  var _this = this;
  dm.ls().then((r) => console.log(r));
  _this.body = 'hello';
});

app.listen(3000);
