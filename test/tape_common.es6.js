import Client from '../lib/client.es6.js';

let auth = {username: 'mocha@osf.io', password: 'password'};
let user_id = 'rgmay';
let authedClient = new Client('http://localhost:8000/v2/', auth);
let client = new Client('http://localhost:8000/v2/');

export default {
  auth: auth,
  user_id: user_id,
  authedClient: authedClient,
  client: client
};
