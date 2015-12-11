import test from 'tape';
import stuff from './common.es6.js';
import _ from 'underscore';

// setup client
let client = stuff.client;
let authedClient = stuff.authedClient;

test('Running node tests', t => {
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

  let embeds = ['contributors', 'node_links', 'comments', 'files', 'logs', 'children'];
  client.nodes().get({query:{embed:embeds}}).then(resp => {
    _.each(resp.data, (item) => {
      // loop through all the objects inside of data
      _.each(embeds, embed => {
        // loop through all the different embed types
        t.equal(typeof item.embeds[embed], 'object', `${embed} was embedded.`);
        t.equal(typeof item.relationships[embed], 'undefined', `${embed} is not a relationship.`);

        if(_.isArray(item.embeds[embed])) {
          _.each(item.embeds[embed], embeddedObj => {
            t.equal(embeddedObj.id, embeddedObj._data.id, 'Extended version id matches basic version id.');
            t.deepEqual(embeddedObj.attributes, embeddedObj._data.attributes, 'Extended version attributes matches basic version attributes.');
          });
        } else {
          t.equal(item.embeds[embed].id, item.embeds[embed]._data.id, 'Extended version id matches basic version id.');
          t.deepEqual(item.embeds[embed].attributes, item.embeds[embed]._data.attributes, 'Extended version attributes matches basic version attributes.');
        }
      });
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
      title: 'api test node',
      description: 'very description, much words',
      category: 'project'
    }
  ).then(resp => {
    t.equal(typeof resp.data.id, 'string', 'Created Node.id is a string');
    t.equal(resp.data.id.length, 5, 'Created Node.id is five characters');
    t.equal(resp.data.type, 'nodes', 'Created Node.type is \'nodes\'');
    global.createdNodeID = resp.data.id;
    global.createdNodeTitle = resp.data.attributes.title;

    authedClient.nodes(global.createdNodeID).update({attributes:{title:global.createdNodeTitle.split("").reverse().join("")}}).then(resp => {
      t.equal(typeof resp, 'object', 'Response is an object');
      t.equal(resp.status, 200, 'Updated successfully');
      t.equal(resp.data.attributes.title, global.createdNodeTitle.split("").reverse().join(""), 'Title updated successfully');

      authedClient.nodes(global.createdNodeID).delete().then(resp => {
        t.equal(typeof resp, 'object', 'Response is an object');
        t.equal(resp.status, 204, 'Response contained no content');
      });
    });
  });









  t.end();
});
