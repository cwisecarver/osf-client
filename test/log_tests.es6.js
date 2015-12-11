import test from 'tape';
import stuff from './common.es6.js';
import _ from 'underscore';

// setup clients
let client = stuff.client;
let authedClient = stuff.authedClient;

test('Running log tests', t => {
  try {
    client.logs().get().then(resp => {
      return resp;
    });
  } catch (e) {
    t.equal(typeof e, 'object', 'An error is an error.');
    t.equal(e.message, 'Must provide an identifier.', 'Logs Require An Idetifier, no listy');
  }
  let logIds = [];
  authedClient.nodes().get({query:{embed:['logs', 'node_links']}}).then(resp => {
    _.each(resp.data, item => {
      _.each(item.embeds.logs, logEntry => {
        logIds.push(logEntry.id);
      });
    });
  });
  _.each(logIds, id => {
    authedClient.logs(id).get().then(resp => {
      t.equal(typeof resp, 'object', 'The Log is an Object');
      t.equal(resp.data.id, id, 'The Log Id Matches The Log Id');
      t.equal(resp.data.type, 'logs', 'The Log is a Log');
    });
  });

  t.end();
});
