import test from 'tape';
import stuff from './common.es6.js';
import _ from 'underscore';

let client = stuff.client;
let authedClient = stuff.authedClient;

test('Running anonymous collection tests', t => {
  client.collections().get().then(resp => {
    t.equal(typeof resp, 'object', 'The Response Object is an Object');
    t.equal(resp.data.length, 0, 'Anonymous User has no Collections');
  });

  t.end();
});

test('Running authedClient collection tests', t => {
  authedClient.collections().get().then(resp => {
    t.equal(typeof resp, 'object', 'The Response Object is an Object');
    t.true(resp.data.length, 'Registered User has Collections');
    t.equal(typeof resp.data[0].id, 'string', 'The Id is a String');
    t.equal(resp.data[0].id.length, 5, 'The Id is Five Characters');
    t.equal(resp.data[0].type, 'collections', 'The Collection is a Collection');
  });

  t.end();
});
