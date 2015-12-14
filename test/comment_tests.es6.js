import test from 'tape';
import stuff from './common.es6.js';
import _ from 'underscore';

let client = stuff.client;
let authedClient = stuff.authedClient;
global.commentIds = [];
test('Running authedClient comment tests', t => {
  authedClient.nodes().get({query:{embed:'comments', 'page[size]':100}}).then(resp => {
    _.each(resp.data, node => {
      _.each(node.embeds.comments.data, comment => {
        global.commentIds.push(comment.id);
      });
    });
    _.each(global.commentIds, commentId => {
      authedClient.comments(commentId).get().then(resp => {
        t.equal(typeof resp, 'object', 'The Response Object is an Object');
        t.true(resp.data.length, 'Registered User has Comments');
        t.equal(typeof resp.data[0].id, 'string', 'The Id is a String');
        t.equal(resp.data[0].id.length, 5, 'The Id is Five Characters');
        t.equal(resp.data[0].type, 'collections', 'The Collection is a Comment');
        t.equal(typeof resp.data[0].relationships.self, 'object', 'The comment has a self relationship');
      });
    });
  });

  t.end();
});
