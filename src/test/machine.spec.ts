require('co-mocha');
require('co-supertest')

import { app } from '../app';
import { expect } from 'chai';
import supertest = require('supertest');

var request = supertest.agent(app.listen())

describe('/machines', () => {

  var getMachines = function *() {
    var res = yield request.get('/machines').expect(200).end();

    expect(res.body).to.have.length.gte(1);
    expect(res.body[0]).to.have.property('name');

    return res.body;
  }

  it('GET /machines should return empty array', function *() {
    var res = yield request.get('/machines').expect(200).end();
    expect(res.body).to.deep.equal([]);
  });

  it('POST /machines should create machine and return inspect object', function *() {
    var res = yield request.post('/machines').send({
      driver: {
        name: 'virtualbox',
        options: {
          'virtualbox-memory': '512'
        }
      }
    }).expect(200).end();
    expect(res.body).to.have.property('DriverName', 'virtualbox');
  });

  it('GET /machines should return array with one item', function *() {
    var res = yield request.get('/machines').expect(200).end();
    expect(res.body).to.have.length.gte(1);
  });

  it('GET /machines/:name should return inspect object', function *() {
    var machines = yield getMachines();
    var machineName = machines[0].name;
    var res = yield request.get('/machines/' + machineName).expect(200).end();

    expect(res.body).to.have.property('DriverName', 'virtualbox');
    expect(res.body).to.have.deep.property('Driver.MachineName', machineName);
  });

  it('DELETE /machines/:name should remove machine', function *() {
    var machines = yield getMachines();
    var machineName = machines[0].name;
    var res = yield request.delete('/machines/' + machineName).expect(200).end();
    expect(res.body).to.deep.equal({value: true});
  });

});
