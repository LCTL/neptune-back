require('co-mocha');
require('co-supertest')

import { app } from '../app';
import { expect } from 'chai';
import * as supertest from 'supertest';

var request = supertest.agent(app.listen())

describe('/local/docker', () => {

  it(`GET /local/docker should return docker info`, function *() {
    var res = yield request.get(`/local/docker`).expect(200).end();
    expect(res.body.ID).to.match(/[0-9A-Z\.]+/);
  });

})
