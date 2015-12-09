import test from 'tape';
import stuff from './tape_common.es6.js';

test('Running client tests', (t) => {
  t.plan(5);

  t.equal(typeof stuff.client.nodes, 'function', 'client.nodes is a function');
  t.equal(typeof stuff.client.users, 'function', 'client.users is a function');
  t.equal(typeof stuff.client.files, 'function', 'client.files is a function');
  t.equal(typeof stuff.client.session, 'object', 'client.session is an object');
  t.equal(typeof stuff.client, 'object', 'client is an object');
});
