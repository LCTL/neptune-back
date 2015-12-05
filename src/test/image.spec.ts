require('co-mocha');
require('co-supertest')

import { app } from '../app';
import { expect } from 'chai';
import * as supertest from 'supertest';

var request = supertest.agent(app.listen())

describe('/machines/:name/images', () => {

  var machineName = 'images-test';
  var imageName = 'redis:2.6';

  before(`Start machine: ${machineName}`, function *() {
    var res = yield request.post(`/machines/${machineName}`).send({
      'driver': 'virtualbox',
      'virtualbox-memory': '512'
    }).expect(200).end();
  });

  after(`Stop and remove machine: ${machineName}`, function *() {
    yield request.post(`/machines/${machineName}/stop`).expect(204).end();
    yield request.delete(`/machines/${machineName}`).expect(204).end();
  });

  it(`GET /machines/${machineName}/images should return empty array`, function *() {
    var res = yield request.get(`/machines/${machineName}/images`).expect(200).end();
    expect(res.body).to.deep.equal([]);
  });

  it(`POST /machines/${machineName}/images should pull busybox images`, function *() {
    var res = yield request.post(`/machines/${machineName}/images`).send({
      fromImage: imageName
    }).expect(200).end();
    expect(res.body).to.match(/[\w]+/);
  });

  it(`GET /machines/${machineName}/images should return empty array with 1 image`, function *() {
    var res = yield request.get(`/machines/${machineName}/images`).expect(200).end();
    expect(res.body).to.have.length(1);
  });

  it(`GET /machines/${machineName}/images/${imageName} should return inspect object`, function *() {
    var res = yield request.get(`/machines/${machineName}/images/${imageName}`).expect(200).end();
    expect(res.body).to.be.not.empty;
    expect(res.body.RepoTags).to.be.include(imageName);
  });

  it(`DELETE /machines/${machineName}/images/${imageName} should remove image`, function *() {
    var res = yield request.delete(`/machines/${machineName}/images/${imageName}`).expect(200).end();
    expect(res.body).to.deep.include({
      Untagged: imageName
    });
  });

  it(`GET /machines/${machineName}/images should return empty array`, function *() {
    var res = yield request.get(`/machines/${machineName}/images`).expect(200).end();
    expect(res.body).to.deep.equal([]);
  });

})
