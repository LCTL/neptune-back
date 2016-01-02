require('co-mocha');
require('co-supertest')

import { app } from '../app';
import { expect } from 'chai';
import * as supertest from 'supertest';

var request = supertest.agent(app.listen())

describe('/local/containers', () => {

  var containerId;

  before(`Remove all comtainers`, function *() {
    var res = yield request.get(`/local/containers`).expect(200).end();
    yield res.body.map(container => {
      return request.delete(`/local/containers/${container.Id}`).send({
        force: true
      }).expect(200).end()
    });
  });

  it(`GET /local/containers should return empty array`, function *() {
    var res = yield request.get(`/local/containers`).send({
      all: true
    }).expect(200).end();
    expect(res.body).to.deep.equal([]);
  });

  it(`POST /local/images should pull redis images`, function *() {
    var res = yield request.post(`/local/images`).send({
      fromImage: 'redis:2.6'
    }).expect(200).end();
    expect(res.body).to.match(/[\w]+/);
  });

  it(`POST /local/containers should create container`, function *() {
    var res = yield request.post(`/local/containers`).send({
      name: 'redis-test',
      Image: 'redis:2.6'
    }).expect(200).end();
    expect(res.body).to.be.not.empty;
    expect(res.body.value).to.match(/[\w]+/);
    containerId = res.body.value
  });

  it(`GET /local/containers should return array with 1 container`, function *() {
    var res = yield request.get(`/local/containers`).query({
      all: true
    }).expect(200).end();
    expect(res.body).to.have.length(1);
  });

  it(`GET /local/containers/:cid should return inspect object and State.Running is false`, function *() {
    var res = yield request.get(`/local/containers/${containerId}`).expect(200).end();
    expect(res.body.State.Running).to.be.false;
  });

  it(`POST /local/containers/:cid/start should start container`, function *() {
    yield request.post(`/local/containers/${containerId}/start`).expect(204).end();
  });

  it(`GET /local/containers/:cid should return inspect object and State.Restarting is true`, function *() {
    var res = yield request.get(`/local/containers/${containerId}`).expect(200).end();
    expect(res.body.State.Running).to.be.true;
  });

  it(`POST /local/containers/:cid/stop should stop container`, function *() {
    yield request.post(`/local/containers/${containerId}/stop`).expect(204).end();
  });

  it(`GET /local/containers/:cid should return inspect object and State.Running is false`, function *() {
    var res = yield request.get(`/local/containers/${containerId}`).expect(200).end();
    expect(res.body.State.Running).to.be.false;
  });

  it(`POST /local/containers/:cid/restart should restart container`, function *() {
    yield request.post(`/local/containers/${containerId}/restart`).expect(204).end();
  });

  it(`GET /local/containers/:cid should return inspect object and State.Restarting is true`, function *() {
    var res = yield request.get(`/local/containers/${containerId}`).expect(200).end();
    expect(res.body.State.Running).to.be.true;
  });

  it(`POST /local/containers/:cid/pause should pause container`, function *() {
    yield request.post(`/local/containers/${containerId}/pause`).expect(204).end();
  });

  it(`GET /local/containers/:cid should return inspect object and State.Restarting is true`, function *() {
    var res = yield request.get(`/local/containers/${containerId}`).expect(200).end();
    expect(res.body.State.Paused).to.be.true;
  });

  it(`POST /local/containers/:cid/unpause should unpause container`, function *() {
    yield request.post(`/local/containers/${containerId}/unpause`).expect(204).end();
  });

  it(`GET /local/containers/:cid should return inspect object and State.Restarting is true`, function *() {
    var res = yield request.get(`/local/containers/${containerId}`).expect(200).end();
    expect(res.body.State.Paused).to.be.false;
  });

  it(`POST /local/containers/:cid/kill should kill container`, function *() {
    yield request.post(`/local/containers/${containerId}/kill`).expect(204).end();
  });

  it(`GET /local/containers/:cid should return inspect object and State.Running is false`, function *() {
    var res = yield request.get(`/local/containers/${containerId}`).expect(200).end();
    expect(res.body.State.Running).to.be.false;
  });

  it(`GET /local/containers/:cid/logs should return logs text`, function *() {
    var res = yield request.get(`/local/containers/${containerId}/logs`).query({
      stdout: true
    }).expect(200).end();
    expect(res.text).to.be.match(/.*Redis.*/i);
  });

  it(`DELETE /local/containers/:cid should remove container`, function *() {
    yield request.delete(`/local/containers/${containerId}`).expect(204).end();
  });

  it(`GET /local/containers should return array with zero container`, function *() {
    var res = yield request.get(`/local/containers`).query({
      all: true
    }).expect(200).end();
    expect(res.body).to.have.length(0);
  });

});
