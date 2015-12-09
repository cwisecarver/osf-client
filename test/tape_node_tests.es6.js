import test from 'tape';
import stuff from './tape_common.es6.js';

test('Running node tests', (t) => {
  t.plan(1);

  let client = stuff.client;
  client.nodes().get().then(resp => {
    t.equal(typeof resp, 'object', 'Response is an object');
  });
});
