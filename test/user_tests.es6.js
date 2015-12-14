// read, update
import test from 'tape';
import stuff from './common.es6.js';
import _ from 'underscore';

let client = stuff.client;
let authedClient = stuff.authedClient;

test('Running user tests', t => {
  client.users().get().then(resp => {
    t.equal(resp.data.length, 10, 'Response has ten users');
    t.equal(typeof resp.data[0].id, 'string', 'User ID is a string');
    t.equal(typeof resp, 'object', 'Response is an object');
    t.equal(resp.data[0].id.length, 5, 'User ID is 5 characters');
  });

  authedClient.users('me').get().then(resp => {
    t.equal(typeof resp, 'object', 'Response is an object');
    let fullName = resp.data.attributes.full_name;
    let userId = resp.data.id;
    console.log(fullName);
    authedClient.users(userId)
      .update({body:{full_name: fullName.split("").reverse().join("")}}).then(resp => {
         console.log(fullName);
         console.log(resp.data.attributes.full_name);
         t.equal(resp.data.attributes.full_name, fullName, 'Username matches');
    });
    authedClient.users(userId)
      .update({body:{full_name: fullName.split("").reverse().join("")}}).then(resp => {
         console.log(fullName);
         console.log(resp.data.attributes.full_name);
         t.equal(resp.data.attributes.full_name, fullName, 'Username matches');
    });
  });

  t.end();
});
