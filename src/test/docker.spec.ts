require('co-mocha');
require('co-supertest')

import { app } from '../app';
import { expect } from 'chai';
import * as supertest from 'supertest';

var request = supertest.agent(app.listen())

describe('/machines/:name/docker', () => {

  var machineName = 'docker-test';

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

  it(`GET /machines/${machineName}/docker should return docker info`, function *() {
    var res = yield request.get(`/machines/${machineName}/docker`).expect(200).end();
    expect(res.body.ID).to.match(/[0-9A-Z\.]+/);
  });

})
