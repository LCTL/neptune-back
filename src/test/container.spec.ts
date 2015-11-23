require('co-mocha');
require('co-supertest')

import { app } from '../app';
import { expect } from 'chai';
import * as supertest from 'supertest';

var request = supertest.agent(app.listen())

describe('/machines/:name/containers', () => {

  var machineName = 'container-test';
  var containerId;

  before(`Start machine: ${machineName}`, function *() {
    var res = yield request.post(`/machines/${machineName}`).send({
      driver: {
        name: 'virtualbox',
        options: {
          'virtualbox-memory': '512'
        }
      }
    }).expect(200).end();
  });

  after(`Stop and remove machine: ${machineName}`, function *() {
    yield request.post(`/machines/${machineName}/stop`).expect(204).end();
    yield request.delete(`/machines/${machineName}`).expect(204).end();
  });

  it(`GET /machines/${machineName}/containers should return empty array`, function *() {
    var res = yield request.get(`/machines/${machineName}/containers`).send({
      all: true
    }).expect(200).end();
    expect(res.body).to.deep.equal([]);
  });

  it(`POST /machines/${machineName}/images should pull redis images`, function *() {
    var res = yield request.post(`/machines/${machineName}/images`).send({
      fromImage: 'redis:2.6'
    }).expect(200).end();
    expect(res.body).to.match(/[\w]+/);
  });

  it(`POST /machines/${machineName}/containers should create container`, function *() {
    var res = yield request.post(`/machines/${machineName}/containers`).send({
      name: 'redis-test',
      Image: 'redis:2.6'
    }).expect(200).end();
    expect(res.body).to.be.not.empty;
    expect(res.body.value).to.match(/[\w]+/);
    containerId = res.body.value
  });

  it(`GET /machines/${machineName}/containers should return array with 1 container`, function *() {
    var res = yield request.get(`/machines/${machineName}/containers`).query({
      all: true
    }).expect(200).end();
    expect(res.body).to.have.length(1);
  });

  it(`GET /machines/${machineName}/containers/:cid should return inspect object and State.Running is false`, function *() {
    var res = yield request.get(`/machines/${machineName}/containers/${containerId}`).expect(200).end();
    expect(res.body.State.Running).to.be.false;
  });

  it(`POST /machines/${machineName}/containers/:cid/start should start container`, function *() {
    yield request.post(`/machines/${machineName}/containers/${containerId}/start`).expect(204).end();
  });

  it(`GET /machines/${machineName}/containers/:cid should return inspect object and State.Restarting is true`, function *() {
    var res = yield request.get(`/machines/${machineName}/containers/${containerId}`).expect(200).end();
    expect(res.body.State.Running).to.be.true;
  });

  it(`POST /machines/${machineName}/containers/:cid/stop should stop container`, function *() {
    yield request.post(`/machines/${machineName}/containers/${containerId}/stop`).expect(204).end();
  });

  it(`GET /machines/${machineName}/containers/:cid should return inspect object and State.Running is false`, function *() {
    var res = yield request.get(`/machines/${machineName}/containers/${containerId}`).expect(200).end();
    expect(res.body.State.Running).to.be.false;
  });

  it(`POST /machines/${machineName}/containers/:cid/restart should restart container`, function *() {
    yield request.post(`/machines/${machineName}/containers/${containerId}/restart`).expect(204).end();
  });

  it(`GET /machines/${machineName}/containers/:cid should return inspect object and State.Restarting is true`, function *() {
    var res = yield request.get(`/machines/${machineName}/containers/${containerId}`).expect(200).end();
    expect(res.body.State.Running).to.be.true;
  });

  it(`POST /machines/${machineName}/containers/:cid/kill should kill container`, function *() {
    yield request.post(`/machines/${machineName}/containers/${containerId}/kill`).expect(204).end();
  });

  it(`GET /machines/${machineName}/containers/:cid should return inspect object and State.Running is false`, function *() {
    var res = yield request.get(`/machines/${machineName}/containers/${containerId}`).expect(200).end();
    expect(res.body.State.Running).to.be.false;
  });

});
