require('co-mocha');
require('co-supertest')

import { app } from '../app';
import { expect } from 'chai';
import * as supertest from 'supertest';

var request = supertest.agent(app.listen())

describe('/machines/:name/hub', () => {

  var machineName = 'hub-test';

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

  it(`GET /machines/${machineName}/hub/images should search images`, function *() {
    var res = yield request.get(`/machines/${machineName}/hub/images`).query({
      term: 'redis'
    }).expect(200).end();
    expect(res.body).to.have.length.gt(0);
  });

});
