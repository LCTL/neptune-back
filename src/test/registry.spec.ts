require('co-mocha');
require('co-supertest')

import { app } from '../app';
import { expect } from 'chai';
import * as supertest from 'supertest';

var request = supertest.agent(app.listen())

describe('/registry', () => {

  it(`GET /registry/central/v1/search should search images`, function *() {
    var res = yield request.get(`/registry/central/v1/search`).query({
      q: 'redis'
    }).expect(200).end();
    expect(res.body.results).to.have.length.gt(0);
  });

});
