const proxy = require('koa-proxy');

const centralRegisterPathRegexp = /^\/registry\/central\/(.*)/;

//TODO: fix use https throw Hostname/IP doesn't match certificate's altnames error
export const central = proxy({
  host: 'http://index.docker.io',
  match: centralRegisterPathRegexp,
  map: function(path) {
    return path.replace(centralRegisterPathRegexp, '/$1');
  }
});
