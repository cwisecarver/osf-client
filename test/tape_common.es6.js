import Client from '../lib/client.es6.js';

let auth = {username: 'mocha@osf.io', password: 'password'};
let user_id = 'rgmay';
let client = new Client('http://localhost:8000/v2/', auth);

export default {
  auth: auth,
  user_id: user_id,
  client: client
};
