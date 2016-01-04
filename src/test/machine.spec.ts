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

  var firstMachineName = function * () {
    var machines = yield getMachines();
    return machines[0].name;
  }

  it('GET /machines should return empty array', function *() {
    var res = yield request.get('/machines').expect(200).end();
    expect(res.body).to.deep.equal([]);
  });

  it('POST /machines should create machine and return inspect object', function *() {
    var res = yield request.post('/machines').send({
      'driver': 'virtualbox',
      'virtualbox-memory': '512'
    }).expect(200).end();
    expect(res.body).to.have.property('DriverName', 'virtualbox');
  });

  it('GET /machines should return array with one item', function *() {
    var res = yield request.get('/machines').expect(200).end();
    expect(res.body).to.have.length.gte(1);
  });

  it('POST /machines/vbox should create machine named vbox and return inspect object', function *() {
    var res = yield request.post('/machines/vbox').send({
      'driver': 'virtualbox',
      'virtualbox-memory': '512'
    }).expect(200).end();
    expect(res.body).to.have.property('DriverName', 'virtualbox');
    expect(res.body).to.have.deep.property('Driver.MachineName', 'vbox');
  });

  it('GET /machines/:name should return inspect object', function *() {
    var machineName = yield firstMachineName();
    var res = yield request.get(`/machines/${machineName}`).expect(200).end();

    expect(res.body).to.have.property('DriverName', 'virtualbox');
    expect(res.body).to.have.deep.property('Driver.MachineName', machineName);
  });

  it('GET /machines/:name/status should return Running', function *() {
    var machineName = yield firstMachineName();
    var res = yield request.get(`/machines/${machineName}/status`).expect(200).end();

    expect(res.body).to.deep.equal({value: 'Running'});
  });

  it('GET /machines/:name/ip should return ip', function *() {
    var machineName = yield firstMachineName();
    var res = yield request.get(`/machines/${machineName}/ip`).expect(200).end();

    expect(res.body.value).to.match(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/ig);
  });

  it('POST /machines/:name/kill should kill machine', function *() {
    var machineName = yield firstMachineName();
    yield request.post(`/machines/${machineName}/kill`).expect(204).end();
  });

  it('GET /machines/:name/status should return Stopped', function *() {
    var machineName = yield firstMachineName();
    var res = yield request.get(`/machines/${machineName}/status`).expect(200).end();

    expect(res.body).to.deep.equal({value: 'Stopped'});
  });

  it('POST /machines/:name/start should start machine', function *() {
    var machineName = yield firstMachineName();
    yield request.post(`/machines/${machineName}/start`).expect(204).end();
  });

  it('GET /machines/:name/status should return Running', function *() {
    var machineName = yield firstMachineName();
    var res = yield request.get(`/machines/${machineName}/status`).expect(200).end();

    expect(res.body).to.deep.equal({value: 'Running'});
  });

  it('POST /machines/:name/start should stop machine', function *() {
    var machineName = yield firstMachineName();
    yield request.post(`/machines/${machineName}/stop`).expect(204).end();
  });

  it('GET /machines/:name/status should return Stopped', function *() {
    var machineName = yield firstMachineName();
    var res = yield request.get(`/machines/${machineName}/status`).expect(200).end();

    expect(res.body).to.deep.equal({value: 'Stopped'});
  });

  it('POST /machines/:name/restart should restart machine', function *() {
    var machineName = yield firstMachineName();
    yield request.post(`/machines/${machineName}/restart`).expect(204).end();
  });

  it('GET /machines/:name/status should return Running', function *() {
    var machineName = yield firstMachineName();
    var res = yield request.get(`/machines/${machineName}/status`).expect(200).end();

    expect(res.body).to.deep.equal({value: 'Running'});
  });

  it('POST /machines/:name/regenerate-certs should regenerate certs for machine', function *() {
    var machineName = yield firstMachineName();
    yield request.post(`/machines/${machineName}/regenerate-certs`).expect(204).end();
  });

  it('DELETE /machines/:name should remove machine', function *() {
    var machineName = yield firstMachineName();
    yield request.delete(`/machines/${machineName}`).expect(204).end();
  });

  it('DELETE /machines/vbox should remove vbox machine', function *() {
    yield request.delete('/machines/vbox').expect(204).end();
  });

});
