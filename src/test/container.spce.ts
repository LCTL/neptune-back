require('co-mocha');
require('co-supertest')

import { app } from '../app';
import { expect } from 'chai';
import * as supertest from 'supertest';

var request = supertest.agent(app.listen())

describe('/machines/:name/containers', () => {

  var machineName = 'container-test';

  before(function *() {
    var res = yield request.post(`/machines/${machineName}`).send({
      driver: {
        name: 'virtualbox',
        options: {
          'virtualbox-memory': '512'
        }
      }
    }).expect(200).end();
  });

  after(function *() {
    yield request.post(`/machines/${machineName}/stop`).end();
    yield request.delete(`/machines/${machineName}`).expect(200).end();
  });

  it(`GET /machines/${machineName}/containers should return empty array`, function *() {
    var res = yield request.get(`/machines/${machineName}/containers`).send({
      all: true
    }).expect(200).end();
    expect(res.body).to.deep.equal([]);
  });

  it(`POST /machines/${machineName}/images should pull busybox images`, function *() {
    var res = yield request.post(`/machines/${machineName}/images`).send({
      fromImage: 'busybox'
    }).expect(200).end();
    expect(res.body).to.match(/[\w]+/);
  });

  it(`POST /machines/${machineName}/containers should create container`, function *() {
    var res = yield request.post(`/machines/${machineName}/containers`).send({
      name: 'busybox-test',
      Image: 'busybox',
      Cmd: ['echo', '1']
    }).expect(200).end();
    expect(res.body).to.be.not.empty;
    expect(res.body.value).to.match(/[\w]+/);
  });

  it(`GET /machines/${machineName}/containers should return array with 1 container`, function *() {
    var res = yield request.get(`/machines/${machineName}/containers`).query({
      all: true
    }).expect(200).end();
    expect(res.body).to.have.length(1);
  });

});
