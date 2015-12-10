import test from 'tape';
import stuff from './tape_common.es6.js';
import _ from 'underscore';

// setup client
let client = stuff.client;
let authedClient = stuff.authedClient;
let nodeId = null;

test('Running node tests', (t) => {
  // anonymous tests
  client.nodes().get().then(resp => {
    global.nodeId = resp.data[0].id;

    client.nodes(global.nodeId).get().then(singleResp => {
      global.node = singleResp.data;
    });

    t.equal(typeof global.nodeId, 'string', 'Node ID is a string');
    t.equal(typeof resp, 'object', 'Response is an object');
    t.equal(resp.data.length, 10, 'Response has ten nodes');
  });

  client.nodes().get({query:{embed:'contributors'}}).then(resp => {
    _.each(resp.data, (item) => {
      t.equal(typeof item.embeds.contributors, 'object', 'Contributor was embedded.');
      t.equal(typeof item.relationships.contributors, 'undefined', 'Contributors are not relationships.');
    });
  });

  client.nodes().get({query:{'filter[public]':'false'}}).then(resp => {
    t.equal(resp.data.length, 0, 'Anonymous users cannot see private nodes.');
  });

  // tests with authorization
  authedClient.nodes().get().then(resp => {
    t.equal(typeof resp, 'object', 'Response is an object');
  });

  authedClient.nodes().get({query:{embed:'contributors'}}).then(resp => {
    _.each(resp.data, (item) => {
      t.equal(typeof item.embeds.contributors, 'object', 'Contributor was embedded.');
      t.equal(typeof item.relationships.contributors, 'undefined', 'Contributors are not relationships.');
    });
  });

  authedClient.nodes().create(
    {
      body: {
        data: {
          type: 'nodes',
          attributes: {
            title: 'api test node',
            description: 'very description, much words',
            category: 'project'
          }
        }
      }
    }
  ).then(resp => {
    t.equal(typeof resp.data.id, 'string', 'Created Node.id is a string');
    t.equal(resp.data.id.length, 5, 'Created Node.id is five characters');
    t.equal(resp.data.type, 'nodes', 'Created Node.type is \'nodes\'');
    global.createdNodeID = resp.data.id;
    authedClient.nodes(global.createdNodeID)
    .delete()
    .then(resp => {
      console.dir(resp);
      t.equal(typeof resp, 'object', 'Response is an object');
    });
  });







  t.end();
});
