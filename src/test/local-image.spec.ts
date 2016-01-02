require('co-mocha');
require('co-supertest')

import { app } from '../app';
import { expect } from 'chai';
import * as supertest from 'supertest';

var request = supertest.agent(app.listen())

describe('/machines/:name/images', () => {

  var imageName = 'redis:2.6';

  before(`Remove all images`, function *() {
    var res = yield request.get(`/local/images`).expect(200).end();
    yield res.body.map(image => {
      return request.delete(`/local/images/${image.Id}`).send({
        force: true
      }).expect(200).end()
    });
  });

  it(`GET /local/images should return empty array`, function *() {
    var res = yield request.get(`/local/images`).expect(200).end();
    expect(res.body).to.deep.equal([]);
  });

  it(`POST /local/images should pull busybox images`, function *() {
    var res = yield request.post(`/local/images`).send({
      fromImage: imageName
    }).expect(200).end();
    expect(res.body).to.match(/[\w]+/);
  });

  it(`GET /local/images should return empty array with 1 image`, function *() {
    var res = yield request.get(`/local/images`).expect(200).end();
    expect(res.body).to.have.length(1);
  });

  it(`GET /local/images/${imageName} should return inspect object`, function *() {
    var res = yield request.get(`/local/images/${imageName}`).expect(200).end();
    expect(res.body).to.be.not.empty;
    expect(res.body.RepoTags).to.be.include(imageName);
  });

  it(`DELETE /local/images/${imageName} should remove image`, function *() {
    var res = yield request.delete(`/local/images/${imageName}`).expect(200).end();
    expect(res.body).to.deep.include({
      Untagged: imageName
    });
  });

  it(`GET /local/images should return empty array`, function *() {
    var res = yield request.get(`/local/images`).expect(200).end();
    expect(res.body).to.deep.equal([]);
  });

})
