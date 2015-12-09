'use strict';

global.should = require('chai').should();
global.expect = require('chai').expect;
global._ = require('underscore');
global.sinon = require('sinon');

import Client from '../lib/client.es6.js';

let auth = {username: 'mocha@osf.io', password: 'password'};
global.user_id = 'rgmay';

global.window = {};

global.client = new Client('http://localhost:8000/v2/', auth);
