var nodedm_1 = require('nodedm');
var koa = require('koa');
var app = koa();
app.use(function* (next) {
    var start = Date.now();
    yield next;
    var ms = Date.now() - start;
    console.log('%s %s - %s', this.method, this.url, ms);
});
app.use(function* () {
    var _this = this;
    nodedm_1.dm.ls().then((r) => console.log(r));
    _this.body = 'hello';
});
app.listen(3000);
